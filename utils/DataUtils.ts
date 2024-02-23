namespace DataUtils {
  export function parseData(_data: string[][] = []) {
    const [headers = [], ...rowsData] = _data
    const jsonDataArray = rowsData
      .map((row) => {
        const obj: Record<
          string,
          string | boolean | undefined
        > = {}
        headers.forEach((header, index) => {
          obj[header] = row[index]
        })
        return obj
      })
      .filter((obj) => Object.keys(obj).length > 0)
    return jsonDataArray
  }

  export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array))
  }

  export function transpose(matrix: unknown[][]) {
    return matrix[0].map((col, i) =>
      matrix.map((row) => row[i]),
    )
  }
}
