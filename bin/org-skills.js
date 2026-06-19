#!/usr/bin/env node
const { program } = require('commander');
const { addSkill } = require('../lib/wrapper');
const { listSkills } = require('../lib/registry');
const { searchSkills } = require('../lib/search');

program
  .name('org-skills')
  .description('Internal CLI for installing approved skills')
  .version('1.0.0');

program
  .command('add <skill>')
  .description('Install an approved skill into this project')
  .action(async (skill) => {
    await addSkill(skill);
  });

program
  .command('list')
  .description('List all registered skills in this project')
  .action(() => {
    listSkills();
  });

  program
  .command('search <query>')
  .description('Search approved skills list')
  .action((query) => {
    searchSkills(query);
  });

program.parse(process.argv);