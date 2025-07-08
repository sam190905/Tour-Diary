// App.jsx
import React, { useState } from "react";
import EntryForm from "./components/EntryForm";
import EntryTable from "./components/EntryTable";
import ExportButton from "./components/ExportButton";
import { translations } from "./translations";
import "./App.css";
import linkedin from '/linkedin.png';
import './assets/fonts/Montserrat.css';


function App() {
  const [entries, setEntries] = useState([]);
  const [language, setLanguage] = useState("en");

  const addEntry = (entry) => {
    setEntries((prevEntries) => [...prevEntries, entry]);
  };
const deleteEntry = (indexToDelete) => {
  setEntries(entries.filter((_, i) => i !== indexToDelete));
};

  return (
    <div className="App">
      <h1 className="app-title">📒 {translations[language].title}</h1>
      <div className="main-layout">
        <div className="left-panel">
          <EntryForm addEntry={addEntry} language={language} />
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
          </div>
          {entries.length > 0 && <EntryTable entries={entries} language={language} onDelete={deleteEntry} />
}
          {entries.length > 0 && <ExportButton entries={entries} language={language} />}
        </div>
      </div>


<footer className="site-footer">
  🧑‍💻 Developed by Samarth Purant | 
  <a href="mailto:">📧 samarthpurant018@gmail.com</a> | 
 <a
    href="https://www.linkedin.com/in/samarth-purant-0560a2301"
    target="_blank"
    rel="noopener noreferrer"
  >
<img src={linkedin} style={{ height: "20px", verticalAlign: "middle" }} alt="LinkedIn" /> 
    LinkedIn
  </a>
    
  
</footer>


    </div>


  );
}

export default App;
