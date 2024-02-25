function GenerateDashboardSheet() {
  const tasksPack = TasksUtils.getTasksPacksList()

  const sortedPacks = tasksPack.sort(
    (a, b) =>
      weekdaysOrder.indexOf(a.weekday.toLowerCase()) -
      weekdaysOrder.indexOf(b.weekday.toLowerCase()),
  )

  dashboardSheet.writeData(sortedPacks, (taskPack) => {
    return {
      city: taskPack.city,
      weekday: taskPack.weekday,
      hour: Number(taskPack.hour),
      task_count: taskPack.getTasksCount(),
      name: taskPack.getFileName(),
      task_complete: Boolean(taskPack.task_complete),
    }
  })
}
