const chalk = require('chalk');
const { APPROVED_SKILLS } = require('./approved-skills');

function searchSkills(query) {
  const matches = Object.keys(APPROVED_SKILLS).filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    console.log(chalk.yellow(`No approved skills matching "${query}".`));
    return;
  }

  console.log(chalk.blue(`\nMatching skills:\n`));
  matches.forEach(name => console.log(chalk.green(`  - ${name} → ${APPROVED_SKILLS[name]}`)));
}

module.exports = { searchSkills };