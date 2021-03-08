export default interface Question {
  title: string
  choices: Array<string>
  answers: Array<string>
  score: number
  difficulty: string
  category: string
}
