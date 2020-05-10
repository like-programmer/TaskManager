const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const getFilterNumber = (tasks) => {
  let repeatingTaskLength = 0;
  tasks.map((task) => {
    for (const key in task.repeatingDays) {
      task.repeatingDays[key] === true ? repeatingTaskLength++ : null;
    }
  });

  const allCount = tasks.length;
  const overdueCount = (tasks.filter((task) => task.dueDate instanceof Date && task.dueDate < Date.now()).length);
  const todayCount = (tasks.filter((task) => task.dueDate instanceof Date && task.dueDate === Date.now())).length;
  const favouriteCount = (tasks.filter((task) => task.isFavourite === true)).length;
  const repeatingCount = repeatingTaskLength;
  const tagsCount = (tasks.filter((task) => task.tags.length > 0)).length;
  const archiveCount = (tasks.filter((task) => task.isArchive === true)).length;
  return [allCount, overdueCount, todayCount, favouriteCount, repeatingCount, tagsCount, archiveCount];
};

const generateFilters = (tasks) => {
  const filterCount = getFilterNumber(tasks);

  return filterNames.map((filter, i) => {
    return {
      title: filter,
      count: filterCount[i],
    };
  });
};

export {generateFilters};
