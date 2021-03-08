import File from './File'

export default interface Folder {
  name: string
  type: string
  path: Array<string>
  children: Array<Folder | File>
}
