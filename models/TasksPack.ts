interface ITasksPack {
  tasks: Task[]
  generated?: boolean
  task_complete?: string
  task_count?: string
  divide_into?: string
  _1?: string
  _2?: string
  _3?: string
  oks?: string
  split_complete?: string
  comments?: string
}

class TaskPack {
  tasks: Task[]
  city: string
  weekday: string
  hour: string
  isToSplit: boolean
  task_complete?: string
  task_count?: string
  divide_into?: string
  _1?: string
  _2?: string
  _3?: string
  oks?: string
  split_complete?: string
  comments?: string

  analyst?: Analyst

  constructor(props: ITasksPack) {
    this.tasks = props.tasks
    const sampleTask = this.tasks[0]

    this.city = sampleTask.city_name
    this.weekday = sampleTask.bub_week
    this.hour = sampleTask.local_hour

    this.isToSplit = false

    this.task_complete = props.task_complete
    this.task_count = props.task_count
    this.divide_into = props.divide_into
    this._1 = props._1
    this._2 = props._2
    this._3 = props._3
    this.oks = props.oks
    this.split_complete = props.split_complete
    this.comments = props.comments
  }

  getFileName() {
    const filename =
      [this.city, this.weekday, this.hour].join('_') + '_'
    return filename
  }
  getTasksCount() {
    return this.tasks.length
  }
  getSheetName() {
    return [this.weekday, this.hour].join('_')
  }
  getTasksBySplitId(value: number) {
    return this.tasks.filter(
      (Task) => Task.splitId == value,
    )
  }
  getSplits() {
    const allSplitsIds = this.tasks.map(
      (Task) => Task.splitId,
    )
    const splitIds = DataUtils.unique(allSplitsIds)
    return splitIds.filter((x) => !!x)
  }

  setToSplit(value: boolean) {
    this.isToSplit = value
  }
}
