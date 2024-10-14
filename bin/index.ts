#!/usr/bin/env node
const fsModule = require('fs')
const yargs = require('yargs')

const timestamp = () => {
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
  
// Define the 'add' command with positional arguments 'name' and 'age'
yargs.command({
  command: 'add <task>', // Command 'add' with required 'task' argument
  describe: 'Add a task',
  
  builder: (yargs: { positional: (arg0: string, arg1: { describe: string; type: string; demandOption: boolean }) => any }) => {
    return yargs
      .positional('task', {
        describe: 'The task to be added',
        type: 'string',
        demandOption: true, // Ensure 'name' is required
      })
  },

  handler: (argv: { task: any }) => {

    fsModule.readFile('./db.json', 'utf8', async function(err: any, data: string) {
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
        status: 'todo',
        description: argv.task,
        timestamp: timestamp(),
        updatedAt: timestamp()
      }
      
      tasks.push(task);

      fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err: any) => { // null, 2 for indentation
        if (err) {
          console.error(err);
          return;
        }
      })
      
      console.log(`Task added successfully (ID: ${getNextId() - 1})`);
    })
  },
});


yargs.command({
  command: 'update <id> <update>',
  describe: 'Updates a task with a certain id from the db.json file',

  builder: (yargs: { positional: (arg0: string, arg1: { describe: string; type: string; demandOption: boolean }) => { (): any; new(): any; positional: { (arg0: string, arg1: { describe: string; type: string; demandOption: boolean }): any; new(): any } } }) => {
    return yargs
    .positional('id', {
      describe: 'Give an id for the task to be updated',
      type: 'number',
      demandOption: true
    })
    
    .positional('update', {
      describe: 'Updates a task',
      type: 'string',
      demandOption: true
    })
  },

  
  handler: (argv: { id: number; update: string }) => {
    fsModule.readFile('db.json', 'utf8', async function (err: string, data: string) {

      if (err) {
        console.log(`Error reading db.json`, err)
        return;
      }

      const tasks = JSON.parse(data);

      const selectedTask = tasks.find((task: { id: any }) => {
        return argv.id === task.id
      });

      selectedTask.description = argv.update
      selectedTask.updatedAt = timestamp()

      console.log(selectedTask);
      
      fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err: any) => {
        if (err) {
          console.log(`Error occured during writing of file`, err)
        }
      })

    })
  }
  
})


yargs.command({
  command: 'delete <id>',
  describe: 'Deletes a task with an id from the db.json file',

  builder: (yargs: { positional: (arg0: string, arg1: { describe: string; type: string; demandOption: boolean }) => any }) => {
    return yargs
    .positional('id', {
      describe: 'Give an id for the task to be deleted',
      type: 'number',
      demandOption: true
    })
  },

  
  handler: (argv: { id: number; update: string }) => {
    fsModule.readFile('db.json', 'utf8', async function (err: string, data: string) {

      if (err) {
        console.log(`Error reading db.json`, err)
        return;
      }

      const tasks = JSON.parse(data)

      const deletedtask = tasks.find((deleteTask: { id: number; }) => {
        return argv.id === deleteTask.id
      })

      tasks.splice(argv.id - 1, 1);
      console.log(deletedtask);
      
      fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err: any) => {
        if (err) {
          console.log(`Error occured during writing of file`, err)
        }
      })

    })
  }
    
})

yargs.command({
  command: 'mark-in-progress <id>',
  describe: 'mark a task as in progress',

  builder: (yargs: { positional: (arg0: string, arg1: { describe: string; type: string; demandOption: boolean; }) => any; }) => {
    return yargs.positional('ID', {
      describe: 'provide an id to mark the task as in progress',
      type: 'number',
      demandOption: true
    })
  },

  handler: (argv: { id: number; }) => {
    fsModule.readFile('db.json', 'utf8', (err: any, data: string) => {
      if (err) {
        console.log(err);
      }

      const tasks = JSON.parse(data);
      const foundTask = tasks.find((task: { id: number; }) => {
        return task.id === argv.id
      });

      foundTask.status = 'in progress';

      fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err: any) => {  // null, 2 for indentation
        if (err) {
          console.error('There was an error writting the file', err)
        }
      })

    })
  }
})

yargs.command({
  command: 'mark-done <id>',
  describe: 'mark a task as done',

  builder: (yargs: { positional: (arg0: string, arg1: { describe: string; type: string; demandOption: boolean; }) => any; }) => {
    return yargs.positional('ID', {
      describe: 'provide an id to mark it as done',
      type: 'number',
      demandOption: true
    })
  },

  handler: (argv: { id: any; }) => {
    fsModule.readFile('db.json', 'utf8', (err: any, data: string) => {
      if (err) {
        console.log(err)
      }

      const tasks = JSON.parse(data);
      const foundTask = tasks.find((task: { id: any; }) => {
        return task.id === argv.id
      })

      foundTask.status = 'done'

      fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err: any) => {
        if (err) {
          console.log(err)
        }
        console.log('marked as done')
      })

    })
  }
})

yargs.command({
  command: 'list [done] [todo] [in-progress]',
  describe: 'lists  all the tasks',

  builder: (yargs) => {
    return yargs
    .positional('done', {
      describe: 'list all tasks or only completed task when `done` is provided',
      type: 'string',
      default: 'all'
    })
    .positional('todo', {
      describe: 'list all tasks or only completed task when `todo` is provided',
      type: 'string',
    })
    .positional('in-progress', {
      describe: 'list all tasks or only completed task when `in-progress` is provided',
      type: 'string',
    })
  },

  handler: (argv) => {
    console.log(argv.done);
    
    fsModule.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      const tasks = JSON.parse(data)
      
      if (argv.done === 'done') {
        const doneTasks = tasks.filter((task) => {
          return task.status === 'done'
        });
        console.log(doneTasks);
      } else if (argv.done === 'todo') {
        const addedTasks = tasks.filter((task) => {
          return task.status === 'todo'
        });
        console.log(addedTasks);
      } else if (argv.done === 'in-progress') {
        const inProgresstasks = tasks.filter((task) => {
          return task.status === 'in progress'
        });
        console.log(inProgresstasks);
      } else {
        console.log(tasks)
      }
      
    })
  }
})

yargs
  .demandCommand(1, 'You need to provide a valid command.') // Ensure a command is required. Requires at least 1 command
  .help() // Automatically provides help text for the CLI
  .argv;


