interface Props {
  sheetName: string
  tasks: Task[]
}
function createSplitSheet({ sheetName, tasks }: Props) {
  const FileSheet = ss.insertSheet().setName(sheetName)

  const baseHeaders = 'route_id week hour minute'
    .split(' ')
    .concat(splitIds.map(String))
  const headers = baseHeaders.concat(['total'])

  FileSheet.getRange(1, 1, 1, headers.length).setValues([
    headers,
  ])

  const tasksData = tasks.map((task) => {
    return [
      task.route_id,
      task.bub_week,
      task.local_hour,
      task.local_minute,
    ]
  })
  const rowsData = tasksData.map((data) =>
    data.concat(splitIds.map(String)),
  )

  FileSheet.getRange(
    3,
    1,
    tasksData.length,
    baseHeaders.length,
  ).setValues(rowsData)

  FormatSplitSheet(
    FileSheet,
    tasksData.length,
    tasksData[0].length,
  )
}
