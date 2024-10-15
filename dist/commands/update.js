import { readTasksFromFile, writeTasksToFile, timestamp } from "./helper.js";
const updateTask = {
    command: "update <id> <updatedTask>",
    describe: "Updates a task with a certain id from the db.json file",
    handler: async (argv) => {
        const tasks = await readTasksFromFile();
        const selectedTask = tasks.find((task) => {
            return argv.id === task.id;
        });
        selectedTask.description = argv.updatedTask;
        selectedTask.updatedAt = timestamp();
        await writeTasksToFile(tasks);
        console.log("Updated");
    },
};
export default updateTask;
