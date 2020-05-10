import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createSortTemplate} from "./components/sort.js";
import {createTaskTemplate} from "./components/task.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createLoadMoreBtnTemplate} from "./components/load-more-btn.js";

import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";

import {render} from "utils.js";


const TASK_COUNT = 21;
const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board.container`);
render(boardElement, createSortTemplate(), `afterbegin`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

tasks.slice(1, showingTaskCount).forEach((task) => {
  render(taskListElement, createTaskTemplate(task), `beforeend`);
});

render(boardElement, createLoadMoreBtnTemplate(), `beforeend`);

const loadMoreBtn = boardElement.querySelector(`.load-more`);
loadMoreBtn.addEventListener(`click`, () => {
  const prevTaskCount = showingTaskCount;
  showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;

  tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
    render(taskListElement, createTaskTemplate(task), `beforeend`);
  });

  if (showingTaskCount >= tasks.length) {
    loadMoreBtn.remove();
  }
});
