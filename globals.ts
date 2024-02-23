type Sheet = GoogleAppsScript.Spreadsheet.Sheet
type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet
type DriveFolder = GoogleAppsScript.Drive.Folder
type DriveFile = GoogleAppsScript.Drive.File

const ss = SpreadsheetApp.getActiveSpreadsheet()
const splitIds = [1, 2, 3]
const tasksSheetName = 'Sheet1'
const weekdaysOrder = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

const SheetNames = {
  assignment: 'assignment',
  tasks: 'tasks',
  configuration: 'configuration',
}
