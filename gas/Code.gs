/**
 * たんごちょう - Google Apps Script backend
 *
 * Stores each user's vocab list as a sheet (one row per entry) in the
 * spreadsheet this script is bound to. Deploy as a Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * API:
 *   GET  ?userId=kenta
 *     -> { list: [{ id, word, meaning }, ...] }
 *   POST body (text/plain, JSON-encoded):
 *     { action: 'add',    userId, word, meaning } -> { list }
 *     { action: 'update', userId, id, word, meaning } -> { list }
 *     { action: 'delete', userId, id } -> { list }
 */

var SHEET_NAME_PREFIX = 'vocab_';

function getSheet_(userId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = SHEET_NAME_PREFIX + userId;
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['id', 'word', 'meaning', 'createdAt']);
  }
  return sheet;
}

function readList_(userId) {
  var sheet = getSheet_(userId);
  var values = sheet.getDataRange().getValues();
  var rows = values.slice(1).filter(function (r) {
    return r[0] !== '' && r[0] !== null;
  });
  return rows
    .map(function (r) {
      return { id: String(r[0]), word: String(r[1]), meaning: String(r[2]) };
    })
    .reverse();
}

function appendEntry_(userId, word, meaning) {
  var sheet = getSheet_(userId);
  var id = Utilities.getUuid();
  sheet.appendRow([id, word, meaning, new Date().toISOString()]);
}

function updateEntry_(userId, id, word, meaning) {
  var sheet = getSheet_(userId);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 2, 1, 2).setValues([[word, meaning]]);
      break;
    }
  }
}

function deleteEntry_(userId, id) {
  var sheet = getSheet_(userId);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var userId = e.parameter.userId;
  if (!userId) return jsonOutput_({ error: 'userId is required' });
  try {
    return jsonOutput_({ list: readList_(userId) });
  } catch (err) {
    return jsonOutput_({ error: String(err) });
  }
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput_({ error: 'invalid JSON body' });
  }

  var action = body.action;
  var userId = body.userId;
  if (!userId) return jsonOutput_({ error: 'userId is required' });

  try {
    if (action === 'add') {
      appendEntry_(userId, body.word, body.meaning);
    } else if (action === 'update') {
      updateEntry_(userId, body.id, body.word, body.meaning);
    } else if (action === 'delete') {
      deleteEntry_(userId, body.id);
    } else {
      return jsonOutput_({ error: 'unknown action: ' + action });
    }
    return jsonOutput_({ list: readList_(userId) });
  } catch (err) {
    return jsonOutput_({ error: String(err) });
  }
}
