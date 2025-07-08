// components/EntryTable.jsx
import React from "react";
import { translations } from "../translations";
import "../App.css";

function EntryTable({ entries, language, onDelete }) {
  const t = translations[language];

  return (
    <div className="styled-box light-theme">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>{t.work}</th>
            <th>{t.departure}</th>
            <th>{t.arrival}</th>
            <th>{t.distance}</th>
            <th>{t.from}</th>
            <th>{t.to}</th>
            <th>{t.vehicle}</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.work}</td>
              <td>{entry.departureTime}</td>
              <td>{entry.arrivalTime}</td>
              <td>{entry.distance}</td>
              <td>{entry.fromLocation}</td>
              <td>{entry.toLocation}</td>
              <td>{entry.vehicle}</td>
              <td>
                <button onClick={() => onDelete(index)} className="styled-button secondary">
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EntryTable;
