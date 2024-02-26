function GetFilesLinks() {
  const tasks = TasksUtils.getAllTasks()
  const tasksPacksList = TasksUtils.organizeTasks(tasks)

  const resultFiles = getResultTasksFiles(tasksPacksList)

  const { city, analysts } = getConfig()

  const AssignmentSheet = AssignmentSheetFactory.create(
    SheetNames.assignment,
    new AssignmentSheetModel({
      resultFiles,
      city,
      analysts,
    }),
  )
    .getOrCreate()
    .read()

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
