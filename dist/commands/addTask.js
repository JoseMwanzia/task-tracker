import { readTasksFromFile, writeTasksToFile, timestamp } from "./helper.js";
// Define the 'add' command with positional arguments 'task'
const addTask = {
    command: "add <task>", // Command 'add' with required 'task' argument
    describe: "Add a task", // Description of the command
    handler: async (argv) => {
        try {
            let tasks = await readTasksFromFile();
            let task = {
                id: 1,
                status: "todo",
                description: argv.task,
                timestamp: timestamp(),
                updatedAt: timestamp(),
            };
            ;
            if (tasks.length === 0) {
                console.log("Tasks are empty, initialized first task.");
                tasks = [task];
                try {
                    return await writeTasksToFile(tasks);
                }
                catch (error) {
                    console.log(error);
                }
            }
            const getNextId = () => {
                let currentId = tasks[tasks.length - 1].id;
                return ++currentId;
            };
            //   const task = {
            //     id: getNextId(),
            //     status: "todo",
            //     description: argv.task,
            //     timestamp: timestamp(),
            //     updatedAt: timestamp(),
            //   };
            const newTask = { ...task, id: getNextId() };
            tasks.push(newTask);
            await writeTasksToFile(tasks);
            console.log(`Task added successfully (ID: ${getNextId() - 1})`);
        }
        catch (error) {
            console.log(error);
        }
    },
};
export default addTask;
