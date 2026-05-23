// ─── CONFIGURATION ──────────────────────────────────────────
// Change these to match your actual file names and IDs
const CONFIG = {
  sheetName:       "Form_Responses",
  templateName:    "Invoice Template",
  outputFolderName:"Generated Invoices",
  orderIdColumn:   7,
  urlColumn:       9,  // column H — where the doc URL gets written
  senderName:      "Gooner Business :D",
};

// ─── MAIN TRIGGER FUNCTION ───────────────────────────────────
// Attach this to "On form submit" trigger in the editor
function onFormSubmit(e) {
  try {
    // Get the sheet and find the last submitted row
    const sheet  = SpreadsheetApp.getActiveSpreadsheet()
                    .getSheetByName(CONFIG.sheetName);
    const lastRow = sheet.getLastRow();
    const rowData = sheet.getRange(lastRow, 1, 1, CONFIG.urlColumn)
                         .getValues()[0]; // [0] gets the single row

    // Build the order object from the row (adjust indices to match your form)
    const order = {
      timestamp: rowData[0],
      customer:  rowData[1].toString().trim(),
      email:     rowData[2].toString().trim().toLowerCase(),
      service:   rowData[3].toString(),
      hourlyRate:    Number(rowData[4]),
      companyName: rowData[5] ? rowData[5].toString().trim() : "",
      orderId:   `ORD-${String(lastRow - 1).padStart(3, "0")}` // auto-generate ID
    };

    Logger.log(`Processing: ${order.customer} — ${order.orderId}`);

    // Write the auto-generated Order ID back to Column F on the sheet
    sheet.getRange(lastRow, CONFIG.orderIdColumn).setValue(order.orderId);

    // Generate the invoice document
    const docUrl = generateInvoice(order);

    // Send the confirmation email
    sendConfirmation(order, docUrl);

    // Write the document URL back to the sheet (column H)
    sheet.getRange(lastRow, CONFIG.urlColumn).setValue(docUrl);

    Logger.log("Done. URL: " + docUrl);

  } catch (err) {
    // Log errors so you can see them in the execution log
    Logger.log("ERROR: " + err.message);
    // Optionally email yourself the error:
    GmailApp.sendEmail(Session.getActiveUser().getEmail(),
      "Script error: onFormSubmit", err.message);
  }
}

// ─── DOCUMENT GENERATION ─────────────────────────────────────
function generateInvoice(order) {
  const template = DriveApp.getFilesByName(CONFIG.templateName).next();
  const folder   = DriveApp.getFoldersByName(CONFIG.outputFolderName).next();
  const copy     = template.makeCopy(`${order.customer} — ${order.orderId}`, folder);
  const doc = DocumentApp.openById(copy.getId()); // Define the document
  const body = doc.getBody();                     // Define the body

  body.replaceText("{{order_id}}",    order.orderId);
  body.replaceText("{{company_name}}", order.companyName)
  body.replaceText("{{client_name}}", order.customer);
  body.replaceText("{{client_email}}", order.email);
  body.replaceText("{{service_description}}",     order.service);
  body.replaceText("{{hourly_rate}}", `₱${order.hourlyRate.toLocaleString()}`);
  body.replaceText("{{invoice_date}}",        new Date().toLocaleDateString("en-PH"));
  doc.saveAndClose(); // must save before getting URL
  return copy.getUrl();
}

// ─── EMAIL CONFIRMATION ──────────────────────────────────────
function sendConfirmation(order, docUrl) {
  const subject = `Invoice ready — ${order.orderId}`;
  const html    = `<p>Hi ${order.customer},</p>
    <p>Your order for <strong>${order.orderId}</strong> has been confirmed.</p>
    <p>I'll soon be getting in touch with you!</p>`;
  GmailApp.sendEmail(order.email, subject, "", {
    htmlBody: html,
    name:     CONFIG.senderName
  });
}
