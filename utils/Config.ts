function getConfig() {
  const configSheet = SheetUtils.getOrCreateSheet(
    ss,
    SheetNames.configuration,
  )

  const monday = configSheet.getRange('F2').getValue()
  const city = configSheet.getRange('F3').getValue()

  const analistsData = DataUtils.parseData(
    configSheet.getRange('A:C').getValues(),
  )
  const analysts = analistsData
    .map((row) => {
      return new Analyst({
        number: Number(row['#']),
        short_name: String(row.short_name),
        name_prefix: String(row.name_prefix),
      })
    })
    .filter((analyst) => {
      return (
        analyst.number &&
        analyst.short_name &&
        analyst.name_prefix
      )
    })

  return {
    monday,
    city,
    analysts,
  }
}

function GenerateConfigSheet() {
  const configSheet = SheetUtils.getOrCreateSheet(
    ss,
    SheetNames.configuration,
  )

  configSheet.getRange('E2').setValue('Monday of Week:')
  configSheet.getRange('E3').setValue('City Prefix:')

  configSheet
    .getRange('A1:C1')
    .setValues([['#', 'short_name', 'name_prefix']])
}
