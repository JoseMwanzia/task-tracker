import { readTasksFromFile, writeTasksToFile } from "./helper.js";

const deleteTask = {
  command: "delete <id>",
  describe: "Deletes a task with an id from the db.json file",

  handler: async (argv) => {
    const tasks = await readTasksFromFile();

    const deletedtask = tasks.find((deleteTask) => {
      return argv.id === deleteTask.id;
    });

    tasks.splice(argv.id - 1, 1);
    console.log(`Deleted task Id ${deletedtask.id}`);

    await writeTasksToFile(tasks);
  },
};

export default deleteTask;
