namespace UiUtils {
  export function toast(message: string) {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      message,
      'Info',
      10,
    )
  }
}
