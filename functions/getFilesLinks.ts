function GetFilesLinks() {
  const sheet = ss.getSheetByName(tasksSheetName)
  if (!sheet) throw new Error('Sheet1 not found')

  const tasksPacksList =
    TasksUtils.getTasksPacksListFromSheet(sheet)

  const dataRows = DataUtils.parseData(
    dashboardSheet.sheet.getDataRange().getValues(),
  )
  for (const taskPack of tasksPacksList) {
    const row = dataRows.find((row) => {
      return (
        row.city === taskPack.city &&
        row.weekday === taskPack.weekday &&
        row.hour === taskPack.hour
      )
    })
    if (!row) continue

    taskPack.setGenerated(Boolean(row.generated))
    taskPack.setToSplit(Boolean(row.split))
  }

  const resultFiles = getResultTasksFiles(tasksPacksList)
  const { city, monday, analysts } = getConfig()

  const AssignmentSheet = AssignmentSheetFactory.create(
    SheetNames.assignment,
    new AssignmentSheetModel({
      resultFiles,
      monday,
      city,
      analysts,
    }),
  ).getOrCreate()

  AssignmentSheet.read()

  const ssDriveFile = DriveApp.getFileById(ss.getId())
  const parentFolder =
    DriveUtils.getParentFolder(ssDriveFile)

  const outputFolder = parentFolder
  const weekdaysMap =
    AssignmentSheet.model.getWeekdaysFoldersMap(
      outputFolder,
    )

  for (const [weekday, folder] of weekdaysMap.entries()) {
    const files = DriveUtils.getFilesInFolder(folder)

    for (const file of files) {
      const fileUrl = file.getUrl()
      const fileRow = resultFiles.find((resultFile) => {
        return resultFile.getName() === file.getName()
      })
      if (!fileRow) continue
      fileRow.setLink(fileUrl)
    }
  }

  AssignmentSheet.write()
}
