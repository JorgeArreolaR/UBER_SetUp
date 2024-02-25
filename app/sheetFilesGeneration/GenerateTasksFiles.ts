function GenerateTasksFiles() {
  SyncTasks()

  const tasks = TasksUtils.getAllTasks()
  const tasksPacksList = TasksUtils.organizeTasks(tasks)
  const resultFiles = getResultTasksFiles(tasksPacksList)

  const outputFolder = DriveUtils.getParentFolder()
  const { city, monday } = getConfig()

  const AssignmentSheet = AssignmentSheetFactory.create(
    SheetNames.assignment,
    new AssignmentSheetModel({
      analysts: [],
      resultFiles: resultFiles,
      city,
      monday,
    }),
  )
    .getOrCreate()
    .read()

  AssignmentSheet.model.setOutputFolder(outputFolder)

  const filesToGenerate =
    AssignmentSheet.model.getFilesToGenerate()

  for (const resultFile of filesToGenerate) {
    resultFile.generateFile()
  }
}
