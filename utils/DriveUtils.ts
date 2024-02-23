namespace DriveUtils {
  export function getSubfolderByName(
    folder: DriveFolder,
    subfolderName: string,
  ): DriveFolder | null {
    const childIterator =
      folder.getFoldersByName(subfolderName)
    if (!childIterator.hasNext()) return null
    return childIterator.next()
  }

  export function getOrCreateSubfolderByName(
    folder: DriveFolder,
    subfolderName: string,
  ) {
    return getSubfolderByName(folder, subfolderName)
  }

  export function getParentFolder(file: DriveFile) {
    return file.getParents().next()
  }

  export function getChildFileByName(
    folder: DriveFolder,
    fileName: string,
  ) {
    const fileIterator = folder.getFilesByName(fileName)
    if (!fileIterator.hasNext()) return null
    return fileIterator.next()
  }

  export function getFilesInFolder(
    folder: DriveFolder,
  ): GoogleAppsScript.Drive.File[] {
    const filesList: GoogleAppsScript.Drive.File[] = []
    const filesIter = folder.getFiles()
    while (filesIter.hasNext()) {
      filesList.push(filesIter.next())
    }

    return filesList
  }
}
