#!/usr/bin/env node
import yargs from "yargs";
import addTask from "../commands/addTask.js";
import updateTask from "../commands/update.js";
import markInProgress from "../commands/markInProgress.js";
import markDone from "../commands/markDone.js";
import deleteTask from "../commands/delete.js";
import allList from "../commands/allList.js";
yargs
    .command(addTask)
    .command(updateTask)
    .command(markInProgress)
    .command(markDone)
    .command(deleteTask)
    .command(allList)
    .demandCommand(1, "You need to provide a valid command.") // Ensure a command is required. Requires at least 1 command
    .help() // Automatically provides help text for the CLI
    .argv;
