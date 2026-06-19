const { execa } = require('execa');
  const chalk = require('chalk');
  const fs = require('fs');
  const path = require('path');
  const { APPROVED_SKILLS } = require('./approved-skills');
  const { registerSkill } = require('./registry');
  const SKILLS_CLI_VERSION = 'skills@1.5.10';

  async function addSkill(skill) {
    // 1. Check approved list
    if (!APPROVED_SKILLS[skill]) {
      console.log(chalk.red(`✖ "${skill}" is not on the approved skills list.`));
      console.log(chalk.yellow('Approved skills: ' + Object.keys(APPROVED_SKILLS).join(', ')));
      process.exit(1);
    }

    const source = APPROVED_SKILLS[skill];
    console.log(chalk.blue(`→ Installing "${skill}" from ${source}...`));

    // 2. Ensure Claude Code folder exists so skills.sh CLI detects it
    const claudeDir = path.join(process.cwd(), '.claude', 'skills');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
      console.log(chalk.gray('  ✔ Created .claude/skills/ for Claude Code detection'));
    }

    // 3. Call npx skills add pointing at internal Bitbucket/GitHub
    await execa('npx', ['-y', SKILLS_CLI_VERSION, 'add', source, '--skill', skill], {
    stdio: 'inherit'
    });

    // 4. Copy SKILL.md into Claude Code path if the agents path got it
    const agentsSkillFile = path.join(process.cwd(), '.agents', 'skills', skill, 'SKILL.md');
    const claudeSkillDir = path.join(claudeDir, skill);
    const claudeSkillFile = path.join(claudeSkillDir, 'SKILL.md');
    if (fs.existsSync(agentsSkillFile) && !fs.existsSync(claudeSkillFile)) {
      fs.mkdirSync(claudeSkillDir, { recursive: true });
      fs.copyFileSync(agentsSkillFile, claudeSkillFile);
      console.log(chalk.gray(`  ✔ Copied SKILL.md to .claude/skills/${skill}/`));
    }

    // 5. Register into registry.json
    registerSkill(skill, source);
    console.log(chalk.green(`✔ "${skill}" installed and registered.`));
  }

  module.exports = { addSkill };
