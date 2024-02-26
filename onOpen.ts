function onOpen() {
  const ui = SpreadsheetApp.getUi()
  ui.createMenu('🚘 DIDI Project Tools')

    .addItem(
      '1. 📋 Generate Dashboard Sheet',
      GenerateDashboardSheet.name,
    )
    .addItem(
      '2. 🔛 Generate Split Sheets',
      GenerateSplitSheets.name,
    )
    .addItem(
      '3. 📝 Generate Assignment Sheet',
      GenerateAssignmentSheet.name,
    )
    .addItem(
      '4. 📓 Generate Final Tasks Files',
      GenerateTasksFiles.name,
    )
    .addItem('5. 🔗 Update Files Links', GetFilesLinks.name)

    .addSeparator()

    .addItem(
      '👾 Tests Sheet Framework',
      TestSheetFramework.name,
    )

    .addItem('🔄 Sync Tasks', SyncTasks.name)

    .addToUi()
}
