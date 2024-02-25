namespace TasksUtils {
  export function getTasksListFromSheet(
    sheet: Sheet,
  ): Task[] {
    return getTasks()
  }

  export function organizeTasks(tasks: Task[]): TaskPack[] {
    const outFilesList: TaskPack[] = []

    const weekdays = DataUtils.unique(
      tasks.map((task) => task.bub_week),
    )
    for (const weekday of weekdays) {
      const tasksOfWeek = tasks.filter(
        (task) => task.bub_week === weekday,
      )
      const hours = DataUtils.unique(
        tasksOfWeek.map((task) => task.local_hour),
      )
      for (const hour of hours) {
        const tasksOfHour = tasksOfWeek.filter(
          (task) => task.local_hour === hour,
        )
        const outputFile = new TaskPack({
          tasks: tasksOfHour,
        })
        outFilesList.push(outputFile)
      }
    }
    return outFilesList
  }

  export function getTasksPacksListFromSheet(
    sheet: Sheet,
  ): TaskPack[] {
    const tasks = getTasksListFromSheet(sheet)
    return organizeTasks(tasks)
  }

  export function getAllTasks() {
    return getTasks()
  }

  export function getTasksPacksList() {
    const tasks = getTasks()
    return organizeAndUpdate(tasks)
  }

  export function updateTasksPacks(
    tasksPacksList: TaskPack[],
  ) {
    const dataRows = DataUtils.parseData(
      dashboardSheet.sheet.getDataRange().getValues(),
    )
    for (const taskPack of tasksPacksList) {
      const row = dataRows.find((row) => {
        return (
          row.weekday === taskPack.weekday &&
          String(row.hour) === String(taskPack.hour)
        )
      })
      if (!row) continue

      taskPack.setToSplit(Boolean(row.split))
    }

    return tasksPacksList
  }

  export function organizeAndUpdate(tasks: Task[]) {
    const tasksPacksList = organizeTasks(tasks)
    updateTasksPacks(tasksPacksList)
    return tasksPacksList
  }
}
