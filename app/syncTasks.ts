function SyncTasks() {
  UiUtils.toast('Syncing tasks...')
  const tasks = TasksUtils.getAllTasks()
  const tasksPacksList = TasksUtils.organizeTasks(tasks)

  const { city } = getConfig()

  // Sync with Dashboard
  const dataRows = DataUtils.parseData(
    dashboardSheet.sheet.getDataRange().getValues(),
  )
  for (const taskPack of tasksPacksList) {
    const row = dataRows.find((row) => {
      return (
        row.city === taskPack.city &&
        row.weekday === taskPack.weekday &&
        String(row.hour) === String(taskPack.hour)
      )
    })
    if (!row) continue

    taskPack.setToSplit(Boolean(row.split))
  }

  // Sync with Assignment Sheet
  const resultFiles = getResultTasksFiles(tasksPacksList)
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

  if (AssignmentSheet.model.resultFiles.length > 0) {
    for (const resultFile of AssignmentSheet.model
      .resultFiles) {
      const analyst = resultFile.getAnalyst()
      const date = resultFile.date
      const cityPrefix = resultFile.city_prefix

      resultFile.getTasks().forEach((task) => {
        if (analyst)
          task.setAnalystPrefix(analyst.getPrefix())

        if (date) task.setDate(date)

        if (cityPrefix) task.setCityPrefix(cityPrefix)
      })
    }
  }

  setTasks(tasks)
  UiUtils.toast('Tasks Synced!')
}
