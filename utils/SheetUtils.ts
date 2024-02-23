namespace SheetUtils {
  export function getOrCreateSheet(
    ss: Spreadsheet,
    sheetName: string,
  ) {
    let sheet = ss.getSheetByName(sheetName)
    if (!sheet) {
      sheet = ss.insertSheet()
      sheet.setName(sheetName)
    }
    return sheet
  }

  export function writeData(
    sheet: Sheet,
    row: number,
    column: number,
    data: unknown[][],
  ) {
    sheet
      .getRange(row, column, data.length, data[0].length)
      .setValues(data)
  }
}
