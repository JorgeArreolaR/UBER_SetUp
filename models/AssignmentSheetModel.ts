class AssignmentSheetModel {
  resultFiles: TasksFile[] = []
  city: string
  analysts: Analyst[]

  fixedColumnsCount: number
  headersCount: number

  outputFolder: GoogleAppsScript.Drive.Folder | null

  constructor(props: {
    city: string
    analysts: Analyst[]
    resultFiles: TasksFile[]
  }) {
    this.city = props.city
    this.analysts = props.analysts
    this.resultFiles = props.resultFiles
    this.fixedColumnsCount = 3
    this.headersCount = 4

    this.outputFolder = null
  }

  setResultsFiles(files: TasksFile[]) {
    this.resultFiles = files
  }

  setAnalysts(users: Analyst[]) {
    this.analysts = users
  }

  getWeekdays() {
    return DataUtils.unique(
      this.resultFiles.map((file) => file.getWeekday()),
    )
  }

  getWeekdaysFoldersMap(
    folder: GoogleAppsScript.Drive.Folder,
  ) {
    const weekdays = this.getWeekdays()
    return getWeekdaysFoldersMap(weekdays, folder)
  }

  getResultFiles() {
    return this.resultFiles
  }

  getFilesToGenerate() {
    return this.resultFiles.filter(
      (file) => file.toGenerate,
    )
  }

  setOutputFolder(folder: GoogleAppsScript.Drive.Folder) {
    this.outputFolder = folder

    const weekdaysFoldersMap =
      this.getWeekdaysFoldersMap(folder)

    this.resultFiles.forEach((file) => {
      const fileFolder = weekdaysFoldersMap.get(
        file.getWeekday(),
      )
      if (!fileFolder)
        throw new Error(
          `Folder for weekday ${file.getWeekday()} not found`,
        )

      file.setParentFolder(fileFolder)
    })
  }
}
