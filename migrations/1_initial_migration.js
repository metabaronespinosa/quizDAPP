const Migrations = artifacts.require('Migrations')
const QuizToken = artifacts.require('QuizToken')

module.exports = function (deployer) {
  deployer.deploy(Migrations)

  const sampleQuizId = 'sampleSurvey'
  const sampleQuizAnswers = ['option2', 'option1', 'option3']

  deployer.deploy(
    QuizToken,
    5 * 10 ** 3,
    sampleQuizId,
    sampleQuizAnswers
  )
}
