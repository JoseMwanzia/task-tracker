import { readTasksFromFile, writeTasksToFile } from "./helper.js";

const markDone = {
  command: "mark-done <id>",
  describe: "mark a task as done",

  handler: async (argv) => {
    const tasks = await readTasksFromFile();

    const foundTask = tasks.find((task) => {
      return task.id === argv.id;
    });

    foundTask.status = "done";

    await writeTasksToFile(tasks);
    console.log("marked as done");
  },
};
export default markDone;
