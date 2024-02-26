function GenerateTasksFiles() {
  SyncTasks()

  const tasks = TasksUtils.getAllTasks()
  const tasksPacksList = TasksUtils.organizeTasks(tasks)
  const resultFiles = getResultTasksFiles(tasksPacksList)

  const outputFolder = DriveUtils.getParentFolder()
  const { city } = getConfig()

  const AssignmentSheet = AssignmentSheetFactory.create(
    SheetNames.assignment,
    new AssignmentSheetModel({
      analysts: [],
      resultFiles: resultFiles,
      city,
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
