import fsModule from "fs";

export function timestamp() {
  return new Date().toLocaleString("en-gb", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export async function readTasksFromFile() {
  return new Promise((resolve, reject) => {
    try {
      fsModule.readFile("./db.json", "utf8", async function (err, data) {
        if (err) {
          console.log(`Error reading db.json:`, err);
          return;
        }
        
        const tasks = await JSON.parse(data);
        resolve(tasks)
      });
    } catch (error) {
      reject(`Error parsing file: ` + error);
    }
  });
}

export async function writeTasksToFile(tasks) {
  await fsModule.writeFile(
    "./db.json",
    JSON.stringify(tasks, null, 2),
    (err) => {
      // null, 2 for indentation
      if (err) {
        console.log(`Error occured during writing of file `, err);
        return;
      }
    }
  );
}
