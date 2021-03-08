import Question from '@/interfaces/Question'

export default interface BatchImportState {
  // 批量提取的结果
  extracted: Array<Question>
  // extracted 数组的下标, 当前操作的指针
  curRender: number
}
