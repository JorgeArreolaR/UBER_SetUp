function generateTasksFile(resultFile: TasksFile) {
  resultFile.generateFile()
}

function getResultTasksFiles(taskPacksList: TaskPack[]) {
  const resultFiles: TasksFile[] = []
  const taskPacksToGenerate = taskPacksList
  // const taskPacksToGenerate = taskPacksList.filter(
  //   (File) => File.isGenerated,
  // )

  for (const tasksPack of taskPacksToGenerate) {
    const requiresSplit = tasksPack.isToSplit

    if (requiresSplit) {
      const SplitSheet = ss.getSheetByName(
        tasksPack.getSheetName(),
      )
      if (!SplitSheet) continue

      // Update the splitId of each Task based on the SplitSheet data
      const dataRows = DataUtils.parseData(
        SplitSheet.getDataRange().getValues(),
      )
      for (const Task of tasksPack.tasks) {
        const row = dataRows.find(
          (row) => Task.route_id === row.route_id,
        )

        if (row === undefined) continue

        for (const splitId of splitIds) {
          if (row[splitId] === true) {
            Task.setSplitId(splitId)
            break
          }
        }
        // Logger.log(`Task ${Task.route_id}: ${Task.splitId}`)
      }
    }

    // Logger.log(`File "${tasksPack.getFileName()}" requires ${splits.length} splits: [${splits.join(", ")}]`)
    for (const split of tasksPack.getSplits()) {
      const resultFile = new TasksFile({
        id: split,
        pack: tasksPack,
      })
      // Logger.log(`> Split ${resultFile.getFileName()} has ${resultFile.getTasksCount()} tasks: [${resultFile.getTasks().map(task => task.route_id).join(", ")}]`)
      resultFiles.push(resultFile)
    }
  }

  return resultFiles
}
