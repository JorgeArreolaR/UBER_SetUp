function FormatSplitSheet(
  sheet: Sheet,
  dataRowsCount: number,
  dataColumnsCount: number,
) {
  sheet
    .getRange(
      3,
      dataColumnsCount + 1,
      dataRowsCount,
      splitIds.length,
    )
    .insertCheckboxes()

  const checksValues = Array(dataRowsCount)
    .fill(0)
    .map(
      (item, index, arr) =>
        index % (Math.floor(arr.length / 30) + 1),
    )
    .map((val) =>
      Array(splitIds.length)
        .fill(0)
        .map((_, index) => index == val),
    )

  sheet
    .getRange(
      3,
      dataColumnsCount + 1,
      dataRowsCount,
      splitIds.length,
    )
    .setValues(checksValues)

  sheet
    .getRange(2, dataColumnsCount + 1, 1, splitIds.length)
    .setFormula(`=COUNTIF(E$3:E; TRUE)`)
  sheet.getRange('H2').setFormula(`=SUM(E2:G2)`)

  sheet.setFrozenRows(2)
  sheet
    .getRange(1, 1, 2, sheet.getLastColumn())
    .setFontSize(11)
    .setFontFamily('Calibri')
    .setHorizontalAlignment('center')
  sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .setFontWeight('bold')
  sheet.autoResizeColumns(1, 8)
}
