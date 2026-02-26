/**
 * Google Apps Script -- FBO Survey Data Collector
 *
 * HOW TO SET UP:
 * 1. Create a new Google Sheet (name it "FBO Survey Responses")
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Deploy > New Deployment
 * 5. Type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click Deploy, authorize when prompted
 * 9. Copy the Web App URL
 * 10. Paste the URL into survey/js/config.js as the dataEndpoint value
 *
 * Each survey submission is appended as a new row.
 * The first submission auto-creates the header row.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Flatten nested objects for spreadsheet storage
    var flat = flattenObject(data);

    // Create headers on first row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = Object.keys(flat);
      sheet.appendRow(headers);
    }

    // Get existing headers (to ensure consistent column order)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Add any new keys as new columns
    var newKeys = Object.keys(flat).filter(function(k) {
      return headers.indexOf(k) === -1;
    });
    if (newKeys.length > 0) {
      for (var i = 0; i < newKeys.length; i++) {
        headers.push(newKeys[i]);
      }
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Build row in header order
    var row = headers.map(function(h) {
      var val = flat[h];
      if (val === undefined || val === null) return "";
      if (typeof val === "object") return JSON.stringify(val);
      return val;
    });

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Flatten a nested object into dot-notation keys.
 * e.g., {a: {b: 1}} -> {"a.b": 1}
 * Arrays are JSON-stringified.
 */
function flattenObject(obj, prefix, result) {
  prefix = prefix || "";
  result = result || {};

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    var fullKey = prefix ? prefix + "." + key : key;
    var val = obj[key];

    if (val === null || val === undefined) {
      result[fullKey] = "";
    } else if (Array.isArray(val)) {
      result[fullKey] = JSON.stringify(val);
    } else if (typeof val === "object" && !(val instanceof Date)) {
      flattenObject(val, fullKey, result);
    } else {
      result[fullKey] = val;
    }
  }

  return result;
}

/**
 * Required for CORS preflight (GET requests from browser).
 * Returns a simple success message.
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "FBO Survey data endpoint is active."
  })).setMimeType(ContentService.MimeType.JSON);
}
