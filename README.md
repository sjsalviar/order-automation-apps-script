# order-automation-apps-script
Automation script for handling orders from clients/customers through google forms sending the order data to google sheets then google apps script handles invoice generation and sends an email confirmation to the customer, script triggers when the google form connected to the script submits a data to the linked spreadsheet. 

## What it does

- Reads new form submissions from a linked Google Sheet
- Copies the Invoice Template from Drive and fills all placeholders
- Sends a confirmation email to the customer
- Writes the document URL back to the Sheet row

## Setup

1. Make a copy of the [Invoice Template](https://docs.google.com/document/d/1oEJ0o1DFFdUe1BGjkaSrcVfJfP7k-TKdvCCD6Ob-u9A/edit?tab=t.0)
2. Create a "Generated Invoices" folder in Google Drive
3. Open the Sheet → Extensions → Apps Script
4. Paste `order-automation-apps-script.gs` into the editor
5. Update the `CONFIG` object at the top with your file names/IDs
6. Add an "On form submit" trigger to `onFormSubmit`

## Skills demonstrated

- Google Apps Script (SpreadsheetApp, DocumentApp, GmailApp, DriveApp)
- Batch read/write with `getValues()` / `setValues()`
- Template automation with `replaceText()`
- Error handling with try/catch
- Form submission triggers

## Technologies

Google Apps Script Google Sheets Google Docs Gmail

# sheets-data-cleaning-script
Automation script for a data quality and validation check for data columns. 

## What it does
- Checks for duplicate IDs (Column A, index 1 on spreadsheet, index 0 on apps script) and highlights it
- Checks for blank cells on the Status column (Column B, index 2 on spreadsheet, index 1 on apps script). also for blank cells all throughout the sheet and highlights it
- Checks for negative numbers and possible outliers on the Amount column (Column E, index 5 on spreadsheet, index 4 on apps script) and highlights it
- Checks for invalid emails on the Email column (Column F, index 6 on spreadsheet, index 5 on apps script) and highlights it
- Adds a new column on Column H with a "Qc status" then pastes the result depending on the different checks done below the column

## Setup

1. Create a Google Forms form with the respective questions on whatever your business is
2. Link a spreadsheet
3. Open the Sheet → Extensions → Apps Script
4. Paste `sheets-data-cleaning-script` into the editor
5. Update the `CONFIG` and the code with your file names/IDs
6. Add an "On form submit" trigger to `onFormSubmit`

## Skills demonstrated

- Google Apps Script (SpreadsheetApp)
- Batch read/write with `getValues()` / `setValues()`

## Technologies

Google Apps Script Google Sheets


