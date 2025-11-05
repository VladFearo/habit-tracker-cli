const fs = require('fs');

// --- load JSON safely ---
let data = [];
try {
  if (fs.existsSync('data.json')) {
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    if (!Array.isArray(data)) data = [];
  }
} catch {
  data = [];
}

const [cmd, ...rest] = process.argv.slice(2);
const input = rest.join(' ').trim();

if (!cmd) {
  console.log('Commands: add <text> | list | done <text> | reset');
  process.exit(0);
}

let dirty = false;

switch (cmd) {
  case 'add': {
    if (input.length > 2) {
      const q = input.toLowerCase();
      const exists = data.some(t => t.taskName?.toLowerCase() === q);
      if (exists) {
        console.log('Task already exists');
      } else {
        data.push({ taskName: input, done: false });
        console.log(`Task added: ${input}`);
        dirty = true;
      }
    } else {
      console.log('Please provide a task name (min 3 chars).');
    }
    break;
  }

  case 'list': {
    if (data.length > 0) {
      data.forEach((e, i) => {
        console.log(`${i + 1}. ${e.done ? '[X]' : '[ ]'} ${e.taskName}`);
      });
    } else {
      console.log('No tasks found.');
    }
    break;
  }

  case 'done': {
    if (data.length > 0 && input.length > 0) {
      const q = input.toLowerCase();
      // exact match first
      let index = data.findIndex(e => e.taskName?.toLowerCase() === q);
      // then substring fallback
      if (index === -1) {
        index = data.findIndex(e => e.taskName?.toLowerCase().includes(q));
      }
      if (index !== -1) {
        data[index].done = true;
        console.log(`Marked "${data[index].taskName}" as done.`);
        dirty = true;
      } else {
        console.log('Task not found.');
      }
    } else {
      console.log('Usage: done <text>');
    }
    break;
  }

  case 'reset': {
    // Clear "done" flags (not deleting tasks)
    if (data.length === 0) {
      console.log('No tasks to reset.');
    } else {
      data.forEach(t => (t.done = false));
      console.log('All tasks set to [ ].');
      dirty = true;
    }
    break;
  }

  default:
    console.log('Unknown command');
}

if (dirty) {
  try {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save data.json:', e.message);
  }
}
