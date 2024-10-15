import { readTasksFromFile, writeTasksToFile } from "./helper.js";
const markInProgress = {
    command: "mark-in-progress <id>",
    describe: "mark a task as in progress",
    handler: async (argv) => {
        const tasks = await readTasksFromFile();
        const foundTask = tasks.find((task) => {
            return task.id === argv.id;
        });
        foundTask.status = "in progress";
        await writeTasksToFile(tasks);
        console.log("marked in-progress");
    },
};
export default markInProgress;
