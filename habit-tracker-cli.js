const fs = require('fs');

const data = fs.existsSync('data.json')? 
JSON.parse(fs.readFileSync('data.json', 'utf8')) 
: [];

const [cmd, ...rest] = process.argv.slice(2);
const input = rest.join(' ').trim();

switch (cmd) {
    case 'add':
        if(input.length > 2){
            data.push({taskName: input, done: false });
            console.log(`Task added: ${input}`);
        }
        break;
    case 'list':
        if(data.length > 0){
        data.forEach((e, i) => {
            console.log(i + 1+"." ,e.done ? "[X]": "[ ]", e.taskName);
        });
        } else {
            console.log("No tasks found.");
        }
        break;

    case 'done':
        if (data.length > 0 && input.length > 0) {
            const index = data.findIndex(e =>
            e.taskName.toLowerCase().includes(input.toLowerCase())
            );

            if (index !== -1) {
            data[index].done = true;
            console.log(`Marked "${data[index].taskName}" as done.`);
            } else {
            console.log("Task not found.");
            }
        }
  break;
    case 'reset':
        data.length = 0;
        console.log("Tasks Cleared")
        break;

    default:
        console.log("Unknown command");
}

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
