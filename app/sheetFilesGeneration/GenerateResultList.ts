function GenerateTasksFilesResult() {
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
      resultFiles: resultFiles,
      city,
      analysts,
      monday,
    }),
  ).getOrCreate()

  // Logger.log(typeof Readed)
  // Logger.log(Readed.model)
  AssignmentSheet.write()

  // AssignmentSheet.read()

  // const ToWrite = AssignmentSheetFactory.create(
  //   SheetNames.assignment + '2',
  //   new AssignmentSheetModel({
  //     city: 'unknown',
  //     users: [],
  //     resultFiles: resultFiles,
  //     monday,
  //   }),
  // ).getOrCreate()

  // ToWrite.model.setResultsFiles(
  //   AssignmentSheet.model.resultFiles,
  // )
  // // Logger.log(ToWrite.model)
  // ToWrite.model.city = AssignmentSheet.model.city
  // ToWrite.model.setAnalysts(AssignmentSheet.model.analysts)
  // ToWrite.model.setResultsFiles(
  //   AssignmentSheet.model.resultFiles,
  // )
  // // Logger.log(ToWrite.model)
  // ToWrite.write()
}
