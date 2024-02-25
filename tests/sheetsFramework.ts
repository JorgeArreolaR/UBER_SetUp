function TestSheetFramework() {
  const tasks = getTasks()

  for (const task of tasks) {
    task.analyst_prefix = 'test'
  }

  setTasks(tasks)
}
