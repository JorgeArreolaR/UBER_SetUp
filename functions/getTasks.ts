function getTasks() {
  const tasksSheet = TasksSheetFactory.init({
    spreadshet: SpreadsheetApp.getActiveSpreadsheet(),
    name: SheetNames.tasks,
  })

  const tasks = tasksSheet.getData((row) => {
    const task = new Task({
      bub_week: row.bub_week,
      city_name: row.city_name,
      country_code: row.country_code,
      distance_type: row.distance_type,
      flat: row.flat,
      flng: row.flng,
      from_addressLine1: row.from_addressLine1,
      from_addressLine2: row.from_addressLine2,
      local_hour: row.local_hour.toString(),
      local_minute: row.local_minute.toString(),
      route_id: row.route_id,
      tlat: row.tlat,
      tlng: row.tlng,
      time_period: row.time_period,
      to_addressLine1: row.to_addressLine1,
      to_addressLine2: row.to_addressLine2,
      analyst_prefix: row.analyst_prefix,
    })

    if (row.local_date)
      task.setDate(
        new Date(row.local_date.replace(/-/g, '/')),
      )
    if (row.split_id) task.setSplitId(row.split_id)

    return task
  })

  return tasks
}
