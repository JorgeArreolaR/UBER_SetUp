const getWeekdaysFoldersMap = (
  weekdays: string[],
  outputFolder: DriveFolder,
): Map<string, DriveFolder> => {
  const weekdaysFoldersMap = new Map<string, DriveFolder>()
  for (const weekday of weekdays) {
    let folder = DriveUtils.getSubfolderByName(
      outputFolder,
      weekday,
    )
    if (!folder) folder = outputFolder.createFolder(weekday)
    weekdaysFoldersMap.set(weekday, folder)
  }

  return weekdaysFoldersMap
}
