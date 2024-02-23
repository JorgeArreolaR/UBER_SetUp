type SheetCellType = string | number | boolean | Date | null
type SheetCellMap = { [key: string]: SheetCellType }
type HookFunction = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
) => void

type SheetOptions<CellMap extends SheetCellMap> = {
  spreadshet: GoogleAppsScript.Spreadsheet.Spreadsheet
  name: string
  columns: CellMap
  postWriteHook?: HookFunction
  postCreateHook?: HookFunction
}

class GoogleSheet<CellMap extends SheetCellMap> {
  sheet: GoogleAppsScript.Spreadsheet.Sheet
  columns: CellMap
  headers: string[] = []

  postWriteHook?: HookFunction
  postCreateHook?: HookFunction

  constructor(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    options: SheetOptions<CellMap>,
  ) {
    this.sheet = sheet
    this.columns = options.columns
    this.headers = Object.keys(this.columns)
    this.postWriteHook = options.postWriteHook
    this.postCreateHook = options.postCreateHook
  }

  static fromName<Headers extends SheetCellMap>(
    options: SheetOptions<Headers>,
  ): GoogleSheet<Headers> {
    const ss = options.spreadshet
    const name = options.name
    const sheet = ss.getSheetByName(name)
    if (!sheet) throw new Error(`${name} not found`)
    return new GoogleSheet(sheet, options)
  }

  static getOrCreateSheet<Headers extends SheetCellMap>(
    options: SheetOptions<Headers>,
  ): GoogleSheet<Headers> {
    const ss = options.spreadshet
    const name = options.name
    const sheet = ss.getSheetByName(name)
    if (sheet) return new GoogleSheet(sheet, options)

    const newSheet = ss.insertSheet(name)
    // options.postCreateHook?.(newSheet)
    const sheetEntity = new GoogleSheet(newSheet, options)

    sheetEntity.postCreateHook?.(sheetEntity.sheet)

    return sheetEntity
  }

  setHeaders(headers: (keyof CellMap)[]) {
    this.headers = headers.map((header) => String(header))
    return this
  }

  writeHeaders() {
    this.sheet
      .getRange(1, 1, 1, this.headers.length)
      .setValues([this.headers])
    return this
  }

  getRange(
    row: number,
    column: number,
    numRows: number,
    numColumns: number,
  ) {
    return this.sheet.getRange(
      row,
      column,
      numRows,
      numColumns,
    )
  }

  writeData<T>(
    data: T[],
    mapper: (data: T) => Partial<CellMap>,
  ) {
    const dataRows = data.map(mapper)

    const headersIndexes: Record<string, number> = {}
    for (const header of this.headers) {
      const index = this.headers.findIndex(
        (h) => h === header,
      )
      if (index === -1)
        throw new Error(`Header ${header} not found`)
      headersIndexes[header] = index
    }

    const dataRowsMapped = dataRows.map((dataRow) => {
      const row: SheetCellType[] = Array(
        this.headers.length,
      ).fill(null)

      for (const key in dataRow) {
        const value = dataRow[key]
        if (value === undefined) continue

        const index = headersIndexes[key]
        if (index === undefined) continue

        if (typeof value === 'number' && isNaN(value)) {
          row[index] = null
          continue
        }

        row[index] = value
      }
      return row
    })

    this.writeHeaders()

    this.getRange(
      2,
      1,
      dataRowsMapped.length,
      this.headers.length,
    ).setValues(dataRowsMapped)

    this.applyColumnTypeFormat()
    this.postWriteHook?.(this.sheet)

    return this
  }

  private getColumnDataRange(column: number) {
    const numRows = this.sheet.getLastRow() - 1
    if (numRows < 1) return null
    return this.sheet.getRange(2, column, numRows, 1)
  }

  applyColumnTypeFormat() {
    for (const header in this.columns) {
      const column = this.headers.indexOf(header) + 1
      const type = typeof this.columns[header]
      const range = this.getColumnDataRange(column)
      if (!range) continue
      if (type === 'string') {
        range.removeCheckboxes().setNumberFormat('@')
      }
      if (type === 'number') {
        range.removeCheckboxes().setNumberFormat('0')
      }
      if (type === 'boolean') {
        range.insertCheckboxes()
      }
    }
  }
}
