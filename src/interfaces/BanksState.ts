import File from '@/interfaces/File'
import Folder from '@/interfaces/Folder'

export default interface BanksState {
  banks: Array<File | Folder>
}
