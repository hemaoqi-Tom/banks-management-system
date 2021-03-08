import Question from './Question'

export default interface File {
  name: string
  type: string
  path: Array<string>
  contents: Array<Question>
}
