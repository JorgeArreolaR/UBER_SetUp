interface IResultFile {
  pack: TaskPack
  id: number
}

class TasksFile {
  pack: TaskPack
  id: number
  date: Date | null
  assignedAnalyst: Analyst | null
  toGenerate: boolean

  outputSheetName: string
  spreadsheet: Spreadsheet | null
  outputFolder: DriveFolder | null
  city_prefix: string

  link: string | null
  done: boolean = false

  predefinedPhotosNamesCount: number

  constructor(props: IResultFile) {
    this.pack = props.pack
    this.id = props.id
    this.date = null
    this.assignedAnalyst = null
    this.toGenerate = false
    this.outputFolder = null
    this.spreadsheet = null
    this.outputSheetName = 'tasks'
    this.predefinedPhotosNamesCount = 4
    this.city_prefix = ''
    this.link = null
  }

  getTasks() {
    return this.pack.getTasksBySplitId(this.id)
  }
  getTasksCount() {
    return this.getTasks().length
  }
  getName() {
    return this.pack.getFileName() + this.id
  }
  getWeekday() {
    return this.pack.weekday
  }
  isLastSplit() {
    const lastSplits = this.pack.getSplits()
    return this.id == lastSplits[lastSplits.length - 1]
  }
  getAnalyst() {
    return this.assignedAnalyst
  }

  getDay() {
    return this.date
  }

  getDayMonth() {
    const tasks = this.getTasks()
    if (tasks.length === 0) return ''

    const sampleTask = tasks[0]
    return sampleTask.getDayMonth()
  }

  getParentFolder() {
    return this.outputFolder
  }

  setDay(day: Date, offset: number = 0) {
    if (offset > 0) day.setDate(day.getDate() + offset)
    this.date = day
  }
  setAnalyst(analyst: Analyst) {
    this.assignedAnalyst = analyst
  }
  setToGenerate(toGenerate: boolean) {
    this.toGenerate = toGenerate
  }

  setParentFolder(folder: DriveFolder) {
    this.outputFolder = folder
  }
  setCityPrefix(prefix: string) {
    this.city_prefix = prefix
  }

  setLink(link: string) {
    this.link = link
  }

  getLink() {
    return this.link
  }

  getOrCreateSpreadsheet() {
    const folder = this.outputFolder
    if (!folder) throw new Error('Output folder not set')
    const name = this.getName()

    let ss: Spreadsheet | null = null
    const _ss = DriveUtils.getChildFileByName(folder, name)

    if (_ss) {
      ss = SpreadsheetApp.openById(_ss.getId())
    } else {
      ss = SpreadsheetApp.create(name)
      DriveApp.getFileById(ss.getId()).moveTo(folder)
    }
    this.spreadsheet = ss
    return ss
  }

  getSheet() {
    this.spreadsheet =
      this.spreadsheet || this.getOrCreateSpreadsheet()
    const sheet = this.spreadsheet.getSheets()[0]
    sheet.setName(this.outputSheetName)
    return sheet
  }

  generateFile() {
    const tasks = this.getTasks()

    const spreadsheet = this.getOrCreateSpreadsheet()
    const sheet = this.getSheet()
    const analyst = this.getAnalyst()

    if (!analyst)
      throw new Error(
        'Analyst not set for ' + this.getName(),
      )

    sheet.getDataRange().clearContent().removeCheckboxes()

    const headers =
      'task_done local_hour local_minute from_address from_lat_lng to_address to_lat_lng time_period bub_week local_date route_id'.split(
        ' ',
      )
    sheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers])

    const rowsData = tasks.map((task) => {
      return [
        task.task_done,
        task.get_local_hour(),
        task.get_local_minute(),
        task.get_from_address(),
        task.get_from_lat_lng(),
        task.get_to_address(),
        task.get_to_lat_lng(),
        task.get_time_period(),
        task.bub_week,
        task.getDateString(),
        task.get_route_id(),
      ]
    })

    sheet
      .getRange(2, 1, rowsData.length, headers.length)
      .setValues(rowsData)

    const photoNamesColumnOffset = headers.length + 1

    const photoNamesHeaders = Array.from(
      { length: this.predefinedPhotosNamesCount * 2 },
      (_, i) => (i % 2 !== 0 ? (i - 1) / 2 + 1 : ''),
    )

    SheetUtils.writeData(sheet, 1, photoNamesColumnOffset, [
      photoNamesHeaders,
    ])

    sheet.getRange('A1:1').setNumberFormat('@')

    sheet
      .getRange(
        2,
        photoNamesColumnOffset,
        rowsData.length,
        photoNamesHeaders.length,
      )
      .setFormula(`=$T$1&"+"&$U$1&"+"&$K2&"+"&L$1`)

    sheet.setConditionalFormatRules([])

    for (
      let i = 0;
      i < this.predefinedPhotosNamesCount;
      i++
    ) {
      const photoPairStartColumn =
        photoNamesColumnOffset + i * 2
      sheet
        .getRange(2, photoPairStartColumn, rowsData.length)
        .setValues(
          Array.from({ length: rowsData.length }, () => [
            false,
          ]),
        )
        .insertCheckboxes()

      const range = sheet.getRange(
        2,
        photoPairStartColumn,
        rowsData.length,
        2,
      )
      const checkboxStartCell = range.getCell(1, 1)
      const column = checkboxStartCell
        .getA1Notation()
        .split('')
        .filter((char) => char.match(/[A-Z]/))
        .join('')
      const row = checkboxStartCell.getRow()
      const formula = `=$${column}${row}`

      Logger.log(range.getA1Notation())
      Logger.log(formula)

      const rules = sheet.getConditionalFormatRules()
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .setRanges([range])
          .whenFormulaSatisfied(formula)
          .setBackground('#D9EAD3')
          .build(),
      )
      sheet.setConditionalFormatRules(rules)

      sheet.setColumnWidth(photoPairStartColumn, 22)
      sheet.setColumnWidth(photoPairStartColumn + 1, 86)
    }

    // sheet
    //   .getRange(
    //     1,
    //     photoNamesColumnOffset,
    //     sheet.getLastRow(),
    //     this.predefinedPhotosNamesCount,
    //   )
    //   .setHorizontalAlignment('center')
    //   .setVerticalAlignment('middle')

    const metadata = [
      analyst.getPrefix(),
      this.getDayMonth(),
    ]

    const metadataColumnOffset =
      photoNamesColumnOffset + photoNamesHeaders.length

    SheetUtils.writeData(sheet, 1, metadataColumnOffset, [
      metadata,
    ])

    FormatTasksFile(sheet)

    UiUtils.toast(`Generated: \n${this.getName()}`)
  }

  isDone() {
    return this.done
  }

  setDone(done: boolean) {
    this.done = done
  }
}
