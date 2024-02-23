function GenerateTasksFiles() {
  const sheet = ss.getSheetByName('Sheet1')
  if (!sheet) throw new Error('Sheet1 not found')

  const taskPacksList =
    TasksUtils.getTasksPacksListFromSheet(sheet)

  const dashboardSheet = ss.getSheetByName('dashboard')
  if (!dashboardSheet)
    throw new Error('dashboard not found')

  const dashboardHeaderRowsCount = 1

  // Update files that are already generated
  const dataRows = DataUtils.parseData(
    dashboardSheet.getDataRange().getValues(),
  )
  for (const taskPack of taskPacksList) {
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

  const ssDriveFile = DriveApp.getFileById(ss.getId())
  const parentFolder =
    DriveUtils.getParentFolder(ssDriveFile)

  const outputFolder = parentFolder

  const inputResultFiles =
    getResultTasksFiles(taskPacksList)

  const { city, monday, analysts } = getConfig()

  const AssignmentSheet = AssignmentSheetFactory.create(
    SheetNames.assignment,
    new AssignmentSheetModel({
      analysts: [],
      resultFiles: inputResultFiles,
      city,
      monday,
    }),
  ).getOrCreate()
  AssignmentSheet.read()

  const resultFiles =
    AssignmentSheet.model.getFilesToGenerate()

  const res = SpreadsheetApp.getUi().alert(
    'There are ' +
      resultFiles.length +
      ' files to generate. Continue?',
    SpreadsheetApp.getUi().ButtonSet.YES_NO,
  )

  if (res !== SpreadsheetApp.getUi().Button.YES) return

  AssignmentSheet.model.setOutputFolder(outputFolder)

  // Generate files
  for (const resultFile of resultFiles) {
    resultFile.generateFile()

    Logger.log(
      `File "${resultFile.getName()}" has ${resultFile.getTasksCount()} tasks: [${resultFile
        .getTasks()
        .map((task) => task.route_id)
        .join(
          ', ',
        )}] in ${resultFile.outputFolder?.getId()}`,
    )
    if (resultFile.isLastSplit()) {
      const pack = resultFile.pack
      const matchRowIndex = dataRows.findIndex(
        (row) =>
          row.city === pack.city &&
          row.weekday === pack.weekday &&
          row.hour === pack.hour,
      )
      const row =
        matchRowIndex + dashboardHeaderRowsCount + 1
      Logger.log(
        `Pack finished: ${pack.getFileName()} index: ${row}`,
      )
      // dashboardSheet.getRange(row, 6).setValue(false)
    }
  }
}
