function FormatTasksFile(sheet: Sheet) {
  sheet.autoResizeColumns(1, sheet.getLastColumn())

  sheet
    .setColumnWidth(1, 22)
    .setColumnWidth(2, 22)
    .setColumnWidth(3, 22)
    .setColumnWidth(4, 178)
    .setColumnWidth(5, 86)
    .setColumnWidth(6, 178)
    .setColumnWidth(7, 86)
    .setColumnWidth(8, 94)
    .setColumnWidth(9, 77)
    .setColumnWidth(10, 60)

  sheet
    .getDataRange()
    .setVerticalAlignment('top')
    .setFontSize(10)
    .setWrap(true)

  sheet
    .getRange(
      1,
      10,
      sheet.getLastRow(),
      sheet.getLastColumn() - 9,
    )
    .setVerticalAlignment('middle')

  // Remove wrap to column (exclude brevious wrap)
  // sheet.getRange(2, 5, sheet.getLastRow() - 1, 1).setWrap(false)
  // sheet.getRange(2, 7, sheet.getLastRow() - 1, 1).setWrap(false)

  sheet
    .getRange('A1:1')
    .setFontSize(11)
    .setFontFamily('Calibri')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')

  sheet.getRange('A1:C1').setFontSize(6)

  sheet.setFrozenRows(1)
  sheet.setFrozenColumns(3)

  const columnsMargin = 10
  const rowsMargin = 20

  sheet
    .getRange(2, 1, sheet.getLastRow() - 1)
    .insertCheckboxes()

  const conditionalFormatRules =
    sheet.getConditionalFormatRules()

  conditionalFormatRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .setRanges([
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 9),
      ])
      .whenFormulaSatisfied('=$A2')
      .setBackground('#D9EAD3')
      .build(),
  )
  sheet.setConditionalFormatRules(conditionalFormatRules)

  try {
    sheet.deleteColumns(
      sheet.getLastColumn() + 1 + columnsMargin,
      sheet.getMaxColumns() -
        sheet.getLastColumn() -
        columnsMargin,
    )
    sheet.deleteRows(
      sheet.getLastRow() + 1 + rowsMargin,
      sheet.getMaxRows() - sheet.getLastRow() - rowsMargin,
    )
  } catch (e) {
    console.error(e)
  }
}
