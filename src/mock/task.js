import {COLORS} from "../const.js";

const desriptionItems = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const tags = new Set([`homework`, `theory`, `practice`, `intensive`, `keks`]);

const defaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getTagsList = (array) => {
  const tagsArray = Array.from(array);
  const startNumber = getRandomIntegerNumber(0, tagsArray.length);
  const tagsCount = getRandomIntegerNumber(0, 4);

  return tagsArray.slice(startNumber, tagsCount);
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, defaultRepeatingDays, {"mo": Math.random() > 0.5});
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    description: getRandomArrayItem(desriptionItems),
    dueDate,
    repeatingDays: dueDate ? defaultRepeatingDays : generateRepeatingDays(),
    tags: getTagsList(tags),
    color: getRandomArrayItem(COLORS),
    isArchive: Math.random() > 0.5,
    isFavourite: Math.random() > 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};
export {generateTasks};
