function GenerateDashboardSheet() {
  const sheet = ss.getSheetByName('Sheet1')
  if (!sheet) throw new Error('Sheet1 not found')

  const tasksPack =
    TasksUtils.getTasksPacksListFromSheet(sheet)

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
      gen: taskPack.isGenerated,
      task_complete: Boolean(taskPack.task_complete),
      divide_into: Number(taskPack.divide_into),
      _1: Number(taskPack._1),
      _2: Number(taskPack._2),
      _3: Number(taskPack._3),
      oks: Number(taskPack.oks),
      split_complete: Boolean(taskPack.split_complete),
      comments: taskPack.comments,
    }
  })
}
