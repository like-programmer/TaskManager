const generateTask = () => {
  return {
    description: `Example default task with default color.`,
    dueDate: new Date(),
    color: `black`,
    repeatingDays: null,
    isArchive: true,
    isFavourite: false
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};
export {generateTask, generateTasks};
