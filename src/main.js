import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createTaskTemplate} from "./components/task.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createLoadMoreBtnTemplate} from "./components/load-more-btn.js";

import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";


const TASK_COUNT = 21;
const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board.container`);
render(boardElement, createSortingTemplate(), `afterbegin`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

for (let i = 1; i < showingTaskCount; i++) {
  render(taskListElement, createTaskTemplate(tasks[i]), `beforeend`);
}

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
