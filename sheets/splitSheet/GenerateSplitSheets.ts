function GenerateSplitSheets() {
  const sheet = ss.getSheetByName('Sheet1')
  if (!sheet) throw new Error('Sheet1 not found')

  const tasksPacks =
    TasksUtils.getTasksPacksListFromSheet(sheet)

  const dashboardSheet = ss.getSheetByName('dashboard')
  if (!dashboardSheet)
    throw new Error('dashboard not found')

  const dataRows = DataUtils.parseData(
    dashboardSheet.getDataRange().getValues(),
  )
  for (const taskPack of tasksPacks) {
    const row = dataRows.find((row) => {
      return (
        row.city === taskPack.city &&
        row.weekday === taskPack.weekday &&
        row.hour === taskPack.hour
      )
    })
    if (!row) continue

    Logger.log(row)
    taskPack.setGenerated(Boolean(row.generated))
    taskPack.setToSplit(Boolean(row.split))
  }

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
