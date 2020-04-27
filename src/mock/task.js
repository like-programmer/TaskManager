const defaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false
};

const generateTask = () => {
  return {
    description: `Example default task with default color.`,
    dueDate: Math.random() > 0.5 ? new Date() : null,
    color: `green`,
    repeatingDays: Object.assign({}, defaultRepeatingDays, {"mo": Math.random() > 0.5}),
    isArchive: Math.random() > 0.5,
    isFavourite: Math.random() > 0.5
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};
export {generateTasks};
