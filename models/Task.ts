interface ITask {
  country_code: string
  city_name: string
  bub_week: string
  local_hour: string
  local_minute: string
  route_id: string
  time_period: string
  from_addressLine1: string
  from_addressLine2: string
  to_addressLine1: string
  to_addressLine2: string
  flng: string
  flat: string
  tlng: string
  tlat: string
  distance_type: string
  analyst_prefix: string
  task_done?: boolean
}

class Task implements ITask {
  country_code: string
  city_name: string
  bub_week: string
  local_hour: string
  local_minute: string
  route_id: string
  time_period: string
  from_addressLine1: string
  from_addressLine2: string
  to_addressLine1: string
  to_addressLine2: string
  flng: string
  flat: string
  tlng: string
  tlat: string
  distance_type: string
  task_done: boolean
  analyst_prefix: string
  date: Date | null
  city_prefix: string | null

  splitId: number

  constructor(props: ITask) {
    this.country_code = props.country_code
    this.city_name = props.city_name
    this.bub_week = props.bub_week
    this.local_hour = props.local_hour
    this.local_minute = props.local_minute
    this.route_id = props.route_id
    this.time_period = props.time_period
    this.from_addressLine1 = props.from_addressLine1
    this.from_addressLine2 = props.from_addressLine2
    this.to_addressLine1 = props.to_addressLine1
    this.to_addressLine2 = props.to_addressLine2
    this.flng = props.flng
    this.flat = props.flat
    this.tlng = props.tlng
    this.tlat = props.tlat
    this.distance_type = props.distance_type
    this.analyst_prefix = props.analyst_prefix
    this.task_done = props.task_done ?? false
    this.date = null
    this.city_prefix = null
    this.splitId = 1
  }

  get_local_hour() {
    return this.local_hour
  }
  get_local_minute() {
    return this.local_minute
  }
  get_from_address() {
    return `${this.from_addressLine1}, ${this.from_addressLine2}`
  }
  get_from_lat_lng() {
    const lng = Number(this.flng)
    const lat = Number(this.flat)
    const pos = lng > 0 ? lng : lat
    const neg = lng <= 0 ? lng : lat
    return [pos, neg].join(', ')
  }
  get_to_address() {
    return `${this.to_addressLine1}, ${this.to_addressLine2}`
  }
  get_to_lat_lng() {
    const lng = Number(this.tlng)
    const lat = Number(this.tlat)
    const pos = lng > 0 ? lng : lat
    const neg = lng <= 0 ? lng : lat
    return [pos, neg].join(', ')
  }
  get_time_period() {
    return this.time_period
  }
  get_route_id() {
    return this.route_id
  }

  setSplitId(number: number) {
    this.splitId = number
  }

  setDate(date: Date) {
    this.date = date
  }

  setCityPrefix(prefix: string) {
    this.city_prefix = prefix
  }

  setAnalystPrefix(prefix: string) {
    this.analyst_prefix = prefix
  }

  getDayMonth() {
    if (this.date === null) return ''
    const day = this.date.getDate()
    const printableDay = day < 10 ? '0' + day : day

    const month = this.date.getMonth() + 1
    const printableMonth = month < 10 ? '0' + month : month
    return `${printableDay}${printableMonth}`
  }

  getDateString() {
    if (this.date === null) return ''
    return Utilities.formatDate(
      this.date,
      'GMT',
      'yyyy-MM-dd',
    )
  }

  getPhotoBaseName() {
    const analyst = this.analyst_prefix
    const dayMonth = this.getDayMonth()
    const city = this.city_prefix
    const route = this.route_id

    if (!analyst || !dayMonth || !city || !route) return ''

    return `${analyst}+${dayMonth}+${route}`
  }

  getPhotoName(number: number) {
    return `${this.getPhotoBaseName()}+${number}`
  }
}
