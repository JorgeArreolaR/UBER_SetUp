const dashboardSheet = GoogleSheet.getOrCreateSheet({
  spreadshet: ss,
  name: 'dashboard',
  columns: {
    city: String(),
    weekday: String(),
    hour: Number(),
    task_count: Number(),
    name: String(),
    split: Boolean(),
  },
  postCreateHook(sheet) {
    sheet.setFrozenRows(1)
    sheet
      .getRange('A1:1')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle')

    sheet.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule()
        .setRanges([sheet.getRange('D1:D1000')])
        .whenNumberGreaterThan(30)
        .setBackground('#FFF2CC')
        .build(),
    ])
  },
  postWriteHook(sheet) {
    sheet.autoResizeColumns(1, sheet.getLastColumn())
  },
})
