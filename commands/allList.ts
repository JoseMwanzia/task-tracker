import { readTasksFromFile } from "./helper.js";

const allList = {
  command: "list [taskType]",
  describe: "lists all the tasks and or statues",

  builder: (yargs) => {
    return yargs.positional("taskType", {
      describe:
        "lists task-status when a task-type argument is provided from the choices",
      type: "string",
      choices: ["done", "todo", "in-progress"],
    });
  },

  handler: async (argv) => {
    console.log(argv.taskType || "All");

    const tasks = await readTasksFromFile();

    const taskStatus = (string) => {
      return tasks.filter((task) => {
        return task.status === string;
      });
    };

    const taskTypes = argv.taskType;
    const validTypes = ["todo", "done", "in-progress"];

    if (validTypes.includes(taskTypes)) {
      console.log(
        taskStatus(taskTypes === "in-progress" ? "in progress" : taskTypes)
      );
    } else {
      console.log(tasks);
    }
  },
};

export default allList;
