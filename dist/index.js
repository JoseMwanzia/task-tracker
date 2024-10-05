#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsModule = require('fs');
const yargs = require('yargs');
const createdAt = () => {
    return new Date().toLocaleString('en-gb', {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};
const updatedAt = () => {
    return new Date().toLocaleString('en-gb', {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};
// Define the 'add' command with positional arguments 'name' and 'age'
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
        fsModule.readFile('./db.json', 'utf8', async function (err, data) {
            if (err) {
                console.log(`Error reading db.json:`, err);
                return;
            }
            const tasks = await JSON.parse(data);
            const getNextId = () => {
                let currentId = tasks[tasks.length - 1].id;
                return ++currentId;
            };
            const task = {
                id: getNextId(),
                status: '',
                description: argv.task,
                createdAt: createdAt(),
                updatedAt: updatedAt()
            };
            tasks.push(task);
            fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            console.log(`Task added successfully (ID: ${getNextId() - 1})`);
        });
    },
});
yargs.command({
    command: 'update <id> <update>',
    describe: 'Updates a task with a certain id from the db.json file',
    builder: (yargs) => {
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
        });
    },
    handler: (argv) => {
        fsModule.readFile('db.json', 'utf8', async function (err, data) {
            if (err) {
                console.log(`Error reading db.json`, err);
                return;
            }
            const tasks = JSON.parse(data);
            const selectedTask = tasks.find((task) => {
                return argv.id === task.id;
            });
            selectedTask.description = argv.update;
            selectedTask.updatedAt = updatedAt();
            console.log(selectedTask);
            fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.log(`Error occured during writing of file`, err);
                }
            });
        });
    }
});

yargs.command({
    command: 'delete <id>',
    describe: 'Deletes a task with a certain id from the db.json file',
    builder: (yargs) => {
        return yargs
            .positional('id', {
            describe: 'Give an id for the task to be deleted',
            type: 'number',
            demandOption: true
        })
    },
    handler: (argv) => {
        fsModule.readFile('db.json', 'utf8', async function (err, data) {
            if (err) {
                console.log(`Error reading db.json`, err);
                return;
            }
            const tasks = JSON.parse(data);
            const selectedTask = tasks.find((task) => {
                return argv.id === task.id;
            });

            
            const splicedArray = tasks.splice(argv.id -1)
            console.log(splicedArray);

            fsModule.writeFile('db.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.log(`Error occured during writing of file`, err);
                }
            });
        });
    }
});
yargs
    .demandCommand(1, 'You need to provide a valid command.') // Ensure a command is required. Requires at least 1 command
    .help() // Automatically provides help text for the CLI
    .argv;
