function GenerateAssignmentSheet() {
  const tasks = TasksUtils.getAllTasks()
  const tasksPacksList = TasksUtils.organizeAndUpdate(tasks)
  const resultFiles = getResultTasksFiles(tasksPacksList)

  const outputFolder = DriveUtils.getParentFolder()
  const { city, analysts } = getConfig()

  const AssignmentSheet = AssignmentSheetFactory.create(
    SheetNames.assignment,
    new AssignmentSheetModel({
      resultFiles: resultFiles,
      city,
      analysts,
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
