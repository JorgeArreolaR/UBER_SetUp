function onOpen() {
  const ui = SpreadsheetApp.getUi()
  ui.createMenu('🚘 DIDI Project Tools')

    .addItem(
      '1. ⚙️ Generate Config Sheet',
      GenerateConfigSheet.name,
    )

    .addItem(
      '2. 📋 Generate Dashboard Sheet',
      GenerateDashboardSheet.name,
    )
    .addItem(
      '3. 🔛 Generate Split Sheets',
      GenerateSplitSheets.name,
    )
    .addItem(
      '4. 📝 Generate Assignment Sheet',
      GenerateTasksFilesResult.name,
    )
    .addItem(
      '5. 📓 Generate Final Tasks Files',
      GenerateTasksFiles.name,
    )
    .addItem('6. 🔗 Update Files Links', GetFilesLinks.name)
    .addToUi()
}
