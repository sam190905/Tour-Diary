// components/EntryForm.jsx
import React, { useState, useEffect } from "react";
import { translations } from "../translations";
import { createRecognizer } from "../utils/speechRecognition";
import "../App.css";

function EntryForm({ addEntry, language }) {
  const t = translations[language];

  const [entry, setEntry] = useState({
    date: "",
    work: "",
    departureTime: "",
    arrivalTime: "",
    distance: "",
    fromLocation: "",
    toLocation: "",
    vehicle: "bus"
  });

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = (field) => {
    const recognizer = createRecognizer(language === "mr" ? "mr-IN" : "en-US", (text) => {
      setEntry((prev) => ({ ...prev, [field]: text }));
    });
    recognizer.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntry(entry);
    setEntry({
      date: "",
      work: "",
      departureTime: "",
      arrivalTime: "",
      distance: "",
      fromLocation: "",
      toLocation: "",
      vehicle: "bus"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="styled-box">
      <input
        type="date"
        name="date"
        value={entry.date}
        onChange={handleChange}
        className="styled-input"
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="work"
          placeholder={t.work}
          value={entry.work}
          onChange={handleChange}
          className="styled-input"
        />
        <button type="button" onClick={() => handleVoiceInput("work")} className="mic-button" title="Voice Input">🎙️</button>
      </div>
      <input
        type="time"
        name="departureTime"
        value={entry.departureTime}
        onChange={handleChange}
        className="styled-input"
      />
      <input
        type="time"
        name="arrivalTime"
        value={entry.arrivalTime}
        onChange={handleChange}
        className="styled-input"
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="distance"
          placeholder={t.distance}
          value={entry.distance}
          onChange={handleChange}
          className="styled-input"
        />
        <button type="button" onClick={() => handleVoiceInput("distance")} className="mic-button" title="Voice Input">🎙️</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="fromLocation"
          placeholder={t.from}
          value={entry.fromLocation}
          onChange={handleChange}
          className="styled-input"
        />
        <button type="button" onClick={() => handleVoiceInput("fromLocation")} className="mic-button" title="Voice Input">🎙️</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="toLocation"
          placeholder={t.to}
          value={entry.toLocation}
          onChange={handleChange}
          className="styled-input"
        />
        <button type="button" onClick={() => handleVoiceInput("toLocation")} className="mic-button" title="Voice Input">🎙️</button>
      </div>
      <select
        name="vehicle"
        value={entry.vehicle}
        onChange={handleChange}
        className="styled-input"
      >
        <option value="bus">Bus</option>
        <option value="private">Private Vehicle</option>
        <option value="walk">Walk</option>
      </select>
      <button type="submit" className="styled-button">
        {t.addEntry}
      </button>
    </form>
  );
}

export default EntryForm;