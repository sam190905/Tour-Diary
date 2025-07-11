// App.jsx
import React, { useState, useEffect } from "react";
import EntryForm from "./components/EntryForm";
import EntryTable from "./components/EntryTable";
import ExportButton from "./components/ExportButton";
import { translations } from "./translations";
import "./App.css";
import linkedin from '/linkedin.png';
import './assets/fonts/Montserrat.css';

function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("diaryEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState("en");

  const addEntry = (entry) => {
    setEntries((prevEntries) => [...prevEntries, entry]);
  };

  const deleteEntry = (indexToDelete) => {
    setEntries(entries.filter((_, i) => i !== indexToDelete));
  };

  const clearAllEntries = () => {
    if (window.confirm("Are you sure you want to delete all entries?")) {
      setEntries([]);
    }
  };

  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  return (
    <div className="App">
      <h1 className="app-title">📒 {translations[language].title}</h1>
      <div className="main-layout">
        <div className="left-panel">
          <EntryForm addEntry={addEntry} language={language} showLabels={{ dateTimeOnly: true }} />
        </div>
        <div className="right-panel">
          <div className="styled-box">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="styled-input"
            >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
            </select>
            {entries.length > 0 && (
              <button className="styled-button secondary" onClick={clearAllEntries}>
                {language === "en" ? "Clear All Entries" : "सर्व नोंदी साफ करा"}
              </button>
            )}
          </div>
{entries.length > 0 && (
  <EntryTable
    entries={[...entries].sort((a, b) => new Date(a.date) - new Date(b.date))}
    language={language}
    onDelete={deleteEntry}
  />
)}
{entries.length > 0 && (
  <ExportButton
    entries={[...entries].sort((a, b) => new Date(a.date) - new Date(b.date))}
    language={language}
  />
)}
        </div>
      </div>
    </div>
  );
}

export default App;
