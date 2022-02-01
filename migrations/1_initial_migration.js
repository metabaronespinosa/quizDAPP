const Migrations = artifacts.require('Migrations')
const QuizToken = artifacts.require('QuizToken')

module.exports = function (deployer) {
  deployer.deploy(Migrations)

  deployer.deploy(QuizToken, 5 * 10 ^ 6)
}
