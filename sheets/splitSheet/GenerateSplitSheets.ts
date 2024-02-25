function GenerateSplitSheets() {
  const tasksPacks = TasksUtils.getTasksPacksList()

  // Collect necesarry data
  const existingFilesSheetNames = ss
    .getSheets()
    .map((sheet) => sheet.getName())
    .filter((name) => name.match(/[a-zA-Z]+_[0-9]+/))

  const filesToSplit = tasksPacks.filter(
    (File) => File.isToSplit,
  )

  // Delete sheets that are no longer in filesToSplit
  for (const sheetName of existingFilesSheetNames) {
    const matchedFile = filesToSplit.find(
      (File) => sheetName === File.getSheetName(),
    )
    if (matchedFile === undefined) {
      // Logger.log("Delete " + sheetName)
      const sheet = ss.getSheetByName(sheetName)
      if (sheet) {
        ss.deleteSheet(sheet)
      }
    }
  }

  // Create missing sheets
  for (const File of filesToSplit) {
    const sheetName = File.getSheetName()
    if (!existingFilesSheetNames.includes(sheetName)) {
      createSplitSheet({
        sheetName: sheetName,
        tasks: File.tasks,
      })
    }
  }
}
