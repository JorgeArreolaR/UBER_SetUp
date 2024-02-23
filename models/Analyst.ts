class Analyst {
  number: number
  short_name: string
  name_prefix: string
  constructor(opts: {
    number: number
    short_name: string
    name_prefix: string
  }) {
    this.number = opts.number
    this.short_name = opts.short_name
    this.name_prefix = opts.name_prefix
  }

  getArrayIndex() {
    return this.number - 1
  }

  getColumnIndex() {
    return this.number
  }

  getPrefix() {
    return this.name_prefix
  }
}
