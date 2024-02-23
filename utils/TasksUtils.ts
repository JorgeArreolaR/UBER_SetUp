namespace TasksUtils {
  export function getTasksListFromSheet(
    sheet: Sheet,
  ): Task[] {
    const rows = sheet.getDataRange().getValues()
    const tasksData = DataUtils.parseData(rows)
    const tasks = tasksData.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (task: any) => new Task(task),
    )
    return tasks
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
}
