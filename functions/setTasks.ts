function setTasks(tasks: Task[]) {
  const tasksSheet = TasksSheetFactory.init({
    spreadshet: SpreadsheetApp.getActiveSpreadsheet(),
    name: SheetNames.tasks,
  })

  tasksSheet.writeData(tasks, (task) => {
    return {
      analyst_prefix: task.analyst_prefix,
      bub_week: task.bub_week,
      city_name: task.city_name,
      local_date: task.date?.toLocaleDateString() ?? '',
      country_code: task.country_code,
      distance_type: task.distance_type,
      flat: task.flat,
      flng: task.flng,
      from_addressLine1: task.from_addressLine1,
      from_addressLine2: task.from_addressLine2,
      local_hour: Number(task.local_hour),
      local_minute: Number(task.local_minute),
      route_id: task.route_id,
      tlat: task.tlat,
      tlng: task.tlng,
      time_period: task.time_period,
      to_addressLine1: task.to_addressLine1,
      to_addressLine2: task.to_addressLine2,
      city_prefix: task.city_prefix ?? '',
      daymonth: task.getDayMonth(),
      photo_name: task.getPhotoBaseName(),
      split_id: task.splitId,
    }
  })
}
