const AssignmentSheetFactory = new EnhancedSheetFactory({
  spreadshet: ss,
  model: AssignmentSheetModel,
  readModel(model, sheet) {
    const { fixedColumnsCount, headersCount } = model

    const analysts: Analyst[] = []
    DataUtils.transpose(sheet.getRange('1:3').getValues())
      .filter(
        (row) => row[0] !== '' && !isNaN(Number(row[0])),
      )
      .forEach((row) => {
        analysts.push(
          new Analyst({
            number: Number(row[0]),
            short_name: String(row[1]),
            name_prefix: String(row[2]),
          }),
        )
      })

    analysts.sort((a, b) => a.number - b.number)
    model.analysts = analysts

    model.city = sheet.getRange('A1').getValue()

    if (sheet.getLastRow() < headersCount + 1) return

    sheet
      .getRange(
        headersCount + 1,
        1,
        sheet.getLastRow() - headersCount,
        fixedColumnsCount + analysts.length + 3,
      )
      .getValues()
      .forEach((row) => {
        const filename = row[0]
        const assignmentCols = row.slice(
          fixedColumnsCount,
          fixedColumnsCount + analysts.length,
        )
        const toGenerate = Boolean(
          row[fixedColumnsCount + analysts.length + 1],
        )

        const done = Boolean(
          row[fixedColumnsCount + analysts.length + 2],
        )

        const file = model.resultFiles.find(
          (file) => file.getName() === filename,
        )

        if (!file) return

        const user = model.analysts.find(
          (analyst) =>
            analyst.number ===
            assignmentCols.findIndex((v) => v === true) + 1,
        )

        if (user) {
          file.setAnalyst(user)
        }

        file.setToGenerate(toGenerate)
        file.setDay(model.monday)
        file.setCityPrefix(model.city)
        file.setDone(done)
      })
  },
  writeModel(model, sheet) {
    const { fixedColumnsCount, headersCount } = model

    sheet.getDataRange().clearContent().removeCheckboxes()
    sheet.getRange('A1').setValue(model.city)

    const users = model.analysts.sort(
      (a, b) => a.number - b.number,
    )
    sheet
      .getRange('C1:C3')
      .setValues([['#'], ['short_name'], ['name_prefix']])

    if (users.length > 0) {
      SheetUtils.writeData(sheet, 1, 4, [
        users.map((user) => user.number),
        users.map((user) => user.short_name),
        users.map((user) => user.name_prefix),
      ])
    }

    const usersDatacolumns = users.length + 1
    const metaColumnOffset =
      fixedColumnsCount + usersDatacolumns

    const resultFiles = model.resultFiles.sort(
      (a, b) =>
        weekdaysOrder.indexOf(
          a.getWeekday().toLowerCase(),
        ) -
        weekdaysOrder.indexOf(b.getWeekday().toLowerCase()),
    )

    if (resultFiles.length > 0) {
      sheet.getRange('A4:A').clearContent()

      sheet
        .getRange('A4:C4')
        .setValues([['file_name', 'tasks', 'dia_mes']])

      sheet
        .getRange(
          headersCount + 1,
          1,
          resultFiles.length,
          1,
        )
        .setRichTextValues(
          resultFiles.map((file) => {
            return [
              SpreadsheetApp.newRichTextValue()
                .setText(file.getName())
                .setLinkUrl(file.getLink())
                .build(),
            ]
          }),
        )

      SheetUtils.writeData(
        sheet,
        5,
        2,
        resultFiles.map((file) => [
          // file.getName(),
          file.getTasksCount(),
          file.getDayMonth(),
        ]),
      )

      SheetUtils.writeData(
        sheet,
        5,
        fixedColumnsCount + 1,
        resultFiles.map((file) => {
          const row = Array(users.length).fill(false)
          const analyst = file.getAnalyst()

          if (analyst) {
            row[analyst.getArrayIndex()] = true
          }

          return row
        }),
      )

      sheet
        .getRange(
          5,
          metaColumnOffset,
          resultFiles.length,
          1,
        )
        .setFormula(
          `=IFNA(INDEX(INDIRECT(ADDRESS(3,4)&":"&ADDRESS(3, COLUMN()-1)), 1, MATCH(TRUE,INDIRECT(ADDRESS(row(), 4)&":"&ADDRESS(row(), COLUMN()-1)), 0)), "")`,
        )
    }

    if (resultFiles.length && users.length) {
      sheet
        .getRange(5, 4, resultFiles.length, users.length)
        .insertCheckboxes()

      SheetUtils.writeData(
        sheet,
        headersCount,
        metaColumnOffset,
        [['analyst', 'generate', 'done']],
      )

      const checkboxesColumn = metaColumnOffset + 1

      sheet
        .getRange(
          headersCount + 1,
          checkboxesColumn,
          resultFiles.length,
        )
        .insertCheckboxes()

      SheetUtils.writeData(
        sheet,
        headersCount + 1,
        checkboxesColumn,
        resultFiles.map((file) => {
          return [file.toGenerate]
        }),
      )

      sheet
        .getRange(
          headersCount + 1,
          metaColumnOffset + 2,
          resultFiles.length,
        )
        .insertCheckboxes()

      SheetUtils.writeData(
        sheet,
        headersCount + 1,
        metaColumnOffset + 2,
        resultFiles.map((file) => {
          return [file.isDone()]
        }),
      )
    }
  },
  postCreateHook(sheet) {
    sheet.setFrozenRows(4)
    sheet.setFrozenColumns(2)
    sheet
      .getRange('A1:1')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle')

    sheet
      .getRange('1:4')
      .setVerticalAlignment('bottom')
      .setHorizontalAlignment('center')
    sheet.getRange('C5:C').setHorizontalAlignment('center')
    sheet.getRange('1:2').setBackground('#63d297')
    sheet.getRange('A1').setFontWeight('bold')
    sheet.getRange('4:4').setFontWeight('bold')
    sheet.getRange('C1:Q3').setFontSize(11)

    sheet.setColumnWidths(3, 15, 87)
    sheet.setRowHeights(1, 3, 27)

    sheet
      .getRange('4:1000')
      .applyRowBanding(
        SpreadsheetApp.BandingTheme.LIGHT_GREY,
      )
      .setHeaderRowColor('#d9ead3')
      .setFirstRowColor('#ffffff')
      .setSecondRowColor('#e7f9ef')
      .setFooterRowColor(null)

    sheet.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule()
        .setRanges([sheet.getRange('A5:1000')])
        .whenFormulaSatisfied('=COUNTIF($D5:$Q5, TRUE)>1')
        .setBackground('#F4CCCC')
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .setRanges([sheet.getRange('A5:1000')])
        .whenFormulaSatisfied('=$S5')
        .setBackground('#C9DAF8')
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .setRanges([sheet.getRange('A5:1000')])
        .whenFormulaSatisfied(
          '=AND(COUNTIF($D5:$Q5, TRUE)=0, $A5<>"")',
        )
        .setBackground('#FFF2CC')
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .setRanges([sheet.getRange('D5:1000')])
        .whenTextEqualTo('TRUE')
        .setFontColor('#38761D')
        .build(),
    ])
  },
  postWriteHook(sheet) {
    sheet.autoResizeColumns(1, 3)
  },
})
