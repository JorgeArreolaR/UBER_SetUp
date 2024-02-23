function testSheetFramework() {
  const sheet = ss.getSheetByName('Sheet1')
  if (!sheet) throw new Error('Sheet1 not found')
  const tasksPack =
    TasksUtils.getTasksPacksListFromSheet(sheet)

  const dashboard2Sheet = GoogleSheet.getOrCreateSheet({
    spreadshet: ss,
    name: 'dashboard2',
    columns: {
      city: String(),
      weekday: String(),
      hour: Number(),
      task_count: Number(),
      name: String(),
      gen: Boolean(),
      split: Boolean(),
      task_complete: Boolean(),
      divide_into: Number(),
      _1: Number(),
      _2: Number(),
      _3: Number(),
      oks: Number(),
      split_complete: Boolean(),
      comments: String(),
    },
  })

  dashboard2Sheet.writeData(tasksPack, (taskPack) => {
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

  dashboard2Sheet.sheet.autoResizeColumns(1, 7)
}
