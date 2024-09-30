#!/usr/bin/env node
const yargs = require('yargs');
const fsModule = require('fs')

const createdAt = () => {
  return new Date().toLocaleString('en-gb', {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const updatedAt = () => {
  return new Date().toLocaleString('en-gb', {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}
  
// Define the 'greet' command with positional arguments 'name' and 'age'
yargs.command({
  command: 'add <task>', // Command 'add' with required 'task'
  describe: 'Add a task',
  
  builder: (yargs) => {
    return yargs
      .positional('task', {
        describe: 'The task to be added',
        type: 'string',
        demandOption: true, // Ensure 'name' is required
      })
      .positional('age', {
        describe: 'The age of the person (optional)',
        type: 'number',
      });
  },

  handler: (argv) => {

    fsModule.readFile('./db.json', 'utf8', async function(err, data) {
      if (err) {
        console.log(`Error reading db.json:`, err)
        return;
      }

      const tasks = await JSON.parse(data)
      
      const getNextId = () => {
        let currentId = tasks[tasks.length - 1].id;
        return ++currentId
      }
      
      const task = {
        id: getNextId(),
        status: '',
        description: argv.task,
        createdAt: createdAt(),
        updatedAt: updatedAt()
      }
      
      tasks.push(task);

      fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err) => { // null, 2 for indentation
        if (err) {
          console.error(err);
        }
      })
      
      console.log(`Task added successfully (ID: ${getNextId() - 1})`);
    })
    
  },
});

yargs
  .demandCommand(1, 'You need to provide a valid command.') // Ensure a command is required. Requires at least 1 command
  .help() // Automatically provides help text for the CLI
  .argv;


