import File from '@/interfaces/File'
import Folder from '@/interfaces/Folder'

export default function accessPath (
  banks: Array<File | Folder>,
  path: Array<string>
): Array<File | Folder> {
  const targetPath: Array<string> = Array.from(path)
  let curFolder: Array<File | Folder> = banks

  // 找到当前插入路径
  while (targetPath.length !== 0) {
    const folderName = (targetPath).shift()
    for (const e of curFolder) {
      if (e.name === folderName) {
        curFolder = (e as Folder).children
        break
      }
    }
  }

  return curFolder as Array<File | Folder>
}
