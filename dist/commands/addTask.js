import { readTasksFromFile, writeTasksToFile, timestamp } from "./helper.js";
import fsModule from 'fs';
// Define the 'add' command with positional arguments 'task'
const addTask = {
    command: "add <task>", // Command 'add' with required 'task' argument
    describe: "Add a task", // Description of the command
    handler: async (argv) => {
        try {
            let tasks = await readTasksFromFile();
            if (tasks.length === 0) {
                console.log('File is empty, initializing with an empty array.');
                const firstTask = {
                    id: 1,
                    status: "todo",
                    description: argv.task,
                    timestamp: timestamp(),
                    updatedAt: timestamp(),
                };
                tasks = firstTask;
                try {
                    fsModule.writeFile("./db.json", JSON.stringify(tasks, null, 2), (err) => {
                        // null, 2 for indentation
                        if (err) {
                            console.log(`Error occured during writing of file `, err);
                            return;
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
            const getNextId = () => {
                let currentId = tasks[tasks.length - 1].id;
                return ++currentId;
            };
            const task = {
                id: getNextId(),
                status: "todo",
                description: argv.task,
                timestamp: timestamp(),
                updatedAt: timestamp(),
            };
            tasks.push(task);
            await writeTasksToFile(tasks);
            console.log(`Task added successfully (ID: ${getNextId() - 1})`);
        }
        catch (error) {
            console.log(error);
        }
    },
};
export default addTask;
