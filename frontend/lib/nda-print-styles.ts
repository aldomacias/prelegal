export function getNdaDocumentStyles(): string {
  return `
    @page {
      margin: 20mm 15mm;
      size: letter;
    }

    body {
      font-family: "Georgia", "Times New Roman", serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1a1a1a;
      margin: 0;
      padding: 20px;
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .intro {
      margin-bottom: 20px;
    }

    .field-section {
      margin-bottom: 16px;
    }

    .field-label {
      font-size: 12px;
      color: #666;
      font-style: italic;
      margin-bottom: 2px;
    }

    .signature-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .signature-table th,
    .signature-table td {
      border: 1px solid #ccc;
      padding: 8px 12px;
      text-align: left;
      font-size: 12px;
    }

    .signature-table th {
      background: #f5f5f5;
      font-weight: 600;
    }

    .signature-line {
      min-height: 32px;
    }

    .footer-note {
      font-size: 11px;
      color: #888;
      margin-top: 20px;
      text-align: center;
    }

    .standard-terms p {
      margin-bottom: 12px;
      text-align: justify;
    }

    hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 32px 0;
    }
  `;
}
