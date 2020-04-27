const generateTask = () => {
  return {
    description: `Example default task with default color.`,
    dueDate: Math.random() > 0.5 ? new Date() : null,
    color: `pink`,
    repeatingDays: null,
    isArchive: Math.random() > 0.5,
    isFavourite: Math.random() > 0.5
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};
export {generateTask, generateTasks};
