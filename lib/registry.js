const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const REGISTRY_PATH = path.join(process.cwd(), 'registry.json');

function registerSkill(skill, source) {
  let registry = { skills: [] };

  if (fs.existsSync(REGISTRY_PATH)) {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  }

  // Avoid duplicates
  const exists = registry.skills.find(s => s.name === skill);
  if (!exists) {
    registry.skills.push({
      name: skill,
      source: source,
      installedAt: new Date().toISOString()
    });
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  }
}

function listSkills() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.log(chalk.yellow('No skills registered yet. Run org-skills add <skill> to install one.'));
    return;
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  if (registry.skills.length === 0) {
    console.log(chalk.yellow('No skills registered yet.'));
    return;
  }

  console.log(chalk.blue('\nRegistered Skills:\n'));
  registry.skills.forEach((skill, index) => {
    console.log(chalk.green(`  ${index + 1}. ${skill.name}`));
    console.log(chalk.gray(`     Source:    ${skill.source}`));
    console.log(chalk.gray(`     Installed: ${skill.installedAt}\n`));
  });
}

module.exports = { registerSkill, listSkills };