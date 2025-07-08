// ExportButton.jsx
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { translations } from "../translations";
import "../assets/fonts/NotoSansDevanagari-normal";
import "../assets/fonts/Montserrat.css";

function ExportButton({ entries, language }) {
  const [name, setName] = useState("");
  const [post, setPost] = useState("");
  const [office, setOffice] = useState("");

  const t = translations[language];

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Tour Diary", {
      pageSetup: { orientation: "landscape" }
    });

    const month = new Date().toLocaleString(language === "en" ? "en-US" : "mr-IN", { month: "long" });
    const year = new Date().getFullYear();
    const headingText = t.monthYearHeading.replace("{month}", month).replace("{year}", year);
    const infoText = `${t.name}: ${name}    ${t.post}: ${post}    ${t.office}: ${office}`;

    sheet.mergeCells("A1:H1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = headingText;
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { size: 14, bold: true };

    sheet.mergeCells("A2:H2");
    const infoCell = sheet.getCell("A2");
    infoCell.value = infoText;
    infoCell.alignment = { horizontal: "center", vertical: "middle" };
    infoCell.font = { size: 12 };

    sheet.addRow([]);

    const headers = language === "mr"
      ? ["दिनांक", "वेळ पासून", "वेळ पर्यंत", "ठिकाण पासून", "ठिकाण पर्यंत", "वाहनाचा प्रकार", "अंतर (कि.मी)", "काम"]
      : ["Date", "Departure Time", "Arrival Time", "From Location", "To Location", "Vehicle Type", "Distance (km)", "Work"];

    const headerRow = sheet.addRow(headers);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "thin" }, right: { style: "thin" }
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDAEEF3" }
      };
    });

    entries.forEach(entry => {
      const row = sheet.addRow([
        entry.date,
        entry.departureTime,
        entry.arrivalTime,
        entry.fromLocation,
        entry.toLocation,
        entry.vehicle,
        entry.distance,
        entry.work
      ]);
      row.eachCell(cell => {
        cell.alignment = { horizontal: "center", wrapText: true };
        cell.border = {
          top: { style: "thin" }, left: { style: "thin" },
          bottom: { style: "thin" }, right: { style: "thin" }
        };
      });
    });

    const totalDistance = entries.reduce((sum, e) => sum + parseFloat(e.distance || 0), 0);
    const totalHours = entries.reduce((sum, e) => {
      const [dHr, dMin] = e.departureTime.split(":").map(Number);
      const [aHr, aMin] = e.arrivalTime.split(":").map(Number);
      let diff = (aHr + aMin / 60) - (dHr + dMin / 60);
      if (diff < 0) diff += 24;
      return sum + diff;
    }, 0);

    sheet.addRow([]);
    const totalRow1 = sheet.addRow([t.totalDistance + ':', totalDistance.toFixed(2) + ' km']);
    const totalRow2 = sheet.addRow([t.totalHours + ':', totalHours.toFixed(2) + ' hrs']);

    [totalRow1, totalRow2].forEach(row => {
      row.eachCell(cell => {
        cell.font = { bold: true };
        cell.border = {
          top: { style: "thin" }, left: { style: "thin" },
          bottom: { style: "thin" }, right: { style: "thin" }
        };
      });
    });

    sheet.columns = [
      { width: 15 }, { width: 15 }, { width: 15 },
      { width: 20 }, { width: 20 }, { width: 18 },
      { width: 15 }, { width: 30 }
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "TourDiary.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    if (language === "mr") {
      doc.addFileToVFS("NotoSansDevanagari-Regular.ttf", window.NotoSansDevanagari);
      doc.addFont("NotoSansDevanagari-Regular.ttf", "NotoSansDevanagari", "normal");
      doc.setFont("NotoSansDevanagari");
    }

    const month = new Date().toLocaleString(language === "en" ? "en-US" : "mr-IN", { month: "long" });
    const year = new Date().getFullYear();
    const headingText = t.monthYearHeading.replace("{month}", month).replace("{year}", year);

    doc.setFontSize(14);
    doc.text(headingText, pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`${t.name}: ${name}    ${t.post}: ${post}    ${t.office}: ${office}`, pageWidth / 2, 25, { align: "center" });

    const headers = language === "mr"
      ? ["दिनांक", "वेळ पासून", "वेळ पर्यंत", "ठिकाण पासून", "ठिकाण पर्यंत", "वाहनाचा प्रकार", "अंतर (कि.मी)", "काम"]
      : ["Date", "Departure Time", "Arrival Time", "From Location", "To Location", "Vehicle Type", "Distance (km)", "Work"];

    const rows = entries.map(e => [
      e.date,
      e.departureTime,
      e.arrivalTime,
      e.fromLocation,
      e.toLocation,
      e.vehicle,
      e.distance,
      e.work
    ]);

    autoTable(doc, {
      startY: 35,
      head: [headers],
      body: rows,
      styles: {
        fontSize: 10,
        font: language === "mr" ? "NotoSansDevanagari" : "helvetica",
        cellPadding: 3,
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [22, 160, 133],
        halign: 'center'
      },
      margin: { left: 10, right: 10 }
    });

    const totalDistance = entries.reduce((sum, e) => sum + parseFloat(e.distance || 0), 0);
    const totalHours = entries.reduce((sum, e) => {
      const [dHr, dMin] = e.departureTime.split(":").map(Number);
      const [aHr, aMin] = e.arrivalTime.split(":").map(Number);
      let diff = (aHr + aMin / 60) - (dHr + dMin / 60);
      if (diff < 0) diff += 24;
      return sum + diff;
    }, 0);

    doc.setFontSize(11);
    doc.text(`${t.totalDistance}: ${totalDistance.toFixed(2)} km`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`${t.totalHours}: ${totalHours.toFixed(2)} hrs`, 14, doc.lastAutoTable.finalY + 20);

    doc.save("TourDiary.pdf");
  };

  return (
    <div className="styled-box">
      <input type="text" placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} className="styled-input" />
      <input type="text" placeholder={t.post} value={post} onChange={(e) => setPost(e.target.value)} className="styled-input" />
      <input type="text" placeholder={t.office} value={office} onChange={(e) => setOffice(e.target.value)} className="styled-input" />
      <button onClick={exportToExcel} className="styled-button">{t.downloadExcel}</button>
      <button onClick={exportToPDF} className="styled-button secondary">{t.downloadPDF}</button>
    </div>
  );
}

export default ExportButton;
