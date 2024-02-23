// type SheetCellType = string | number | boolean | Date | null
// type SheetCellMap = { [key: string]: SheetCellType }

// type SheetModelType = new (...args: any[]) => any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SheetModelType<T = any> = new (...args: any) => T

type test = SheetModelType<string>
type test2 = InstanceType<test>

// type HookFunction = (
//   sheet: GoogleAppsScript.Spreadsheet.Sheet,
// ) => void

type WriteFuncion<T extends SheetModelType> = (
  model: InstanceType<T>,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
) => void

type ReadFunction<T extends SheetModelType> = (
  model: InstanceType<T>,
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
) => void

type EnhancedSheetOptions<
  SheetModel extends SheetModelType,
> = {
  spreadshet: GoogleAppsScript.Spreadsheet.Spreadsheet
  name: string
  postWriteHook?: HookFunction
  postCreateHook?: HookFunction

  model: InstanceType<SheetModel>
  writeModel: WriteFuncion<SheetModel>
  readModel: ReadFunction<SheetModel>
}

class GoogleEnhancedSheet<
  SheetModel extends SheetModelType,
> {
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  sheet: GoogleAppsScript.Spreadsheet.Sheet

  private postWriteHook?: HookFunction
  private postCreateHook?: HookFunction

  model: InstanceType<SheetModel>
  private writeModel: WriteFuncion<SheetModel>
  private readModel: ReadFunction<SheetModel>

  constructor(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    options: EnhancedSheetOptions<SheetModel>,
  ) {
    this.sheet = sheet
    this.spreadsheet = options.spreadshet
    this.postWriteHook = options.postWriteHook
    this.postCreateHook = options.postCreateHook
    this.model = options.model
    this.writeModel = options.writeModel
    this.readModel = options.readModel
  }

  write() {
    this.writeModel(this.model, this.sheet)
    if (this.postWriteHook) {
      this.postWriteHook(this.sheet)
    }
  }

  read() {
    this.readModel(this.model, this.sheet)
  }
}

class EnhancedSheet<SheetModel extends SheetModelType> {
  private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  private sheetName: string
  constructor(
    private options: EnhancedSheetOptions<SheetModel>,
  ) {
    this.spreadsheet = options.spreadshet
    this.sheetName = options.name
  }

  exists() {
    return Boolean(
      this.spreadsheet.getSheetByName(this.sheetName),
    )
  }

  create() {
    const sheet = this.spreadsheet.insertSheet(
      this.sheetName,
    )
    this.options.postCreateHook?.(sheet)
    return new GoogleEnhancedSheet<SheetModel>(
      sheet,
      this.options,
    )
  }

  get() {
    const sheet = this.spreadsheet.getSheetByName(
      this.sheetName,
    )
    if (!sheet) {
      throw new Error(
        `Sheet ${this.sheetName} does not exist in spreadsheet`,
      )
    }
    return new GoogleEnhancedSheet<SheetModel>(
      sheet,
      this.options,
    )
  }

  delete() {
    const sheet = this.spreadsheet.getSheetByName(
      this.sheetName,
    )
    if (sheet) {
      this.spreadsheet.deleteSheet(sheet)
    }
  }

  getOrCreate() {
    if (this.exists()) {
      return this.get()
    }
    return this.create()
  }

  setName(name: string) {
    this.sheetName = name
  }
}

type EnhancedSheetFactoryOptions<
  SheetModel extends SheetModelType,
> = {
  spreadshet: GoogleAppsScript.Spreadsheet.Spreadsheet
  postWriteHook?: HookFunction
  postCreateHook?: HookFunction
  model: SheetModel
  writeModel: WriteFuncion<SheetModel>
  readModel: ReadFunction<SheetModel>
}

class EnhancedSheetFactory<
  SheetModel extends SheetModelType,
> {
  constructor(
    private options: EnhancedSheetFactoryOptions<SheetModel>,
  ) {}

  create(name: string, model: InstanceType<SheetModel>) {
    return new EnhancedSheet<SheetModel>({
      ...this.options,
      model,
      name,
    })
  }
}
