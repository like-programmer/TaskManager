import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createTaskTemplate} from "./components/task.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createLoadBtnTemplate} from "./components/load-btn.js";

import {generateFilters} from "./mock/filter.js";


const TASK_COUNT = 3;
const filters = generateFilters();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteWrapper = document.querySelector(`.main`);
const siteHeader = siteWrapper.querySelector(`.main__control`);

render(siteHeader, createSiteMenuTemplate(), `beforeend`);
render(siteWrapper, createFilterTemplate(filters), `beforeend`);
render(siteWrapper, createBoardTemplate(), `beforeend`);

const board = siteWrapper.querySelector(`.board.container`);
render(board, createSortingTemplate(), `afterbegin`);

const taskList = siteWrapper.querySelector(`.board__tasks`);

render(taskList, createTaskEditTemplate(), `beforeend`);

new Array(TASK_COUNT).fill(``).forEach(() => {
  render(taskList, createTaskTemplate(), `beforeend`);
});

const contentWrapper = siteWrapper.querySelector(`.board.container`);
render(contentWrapper, createLoadBtnTemplate(), `beforeend`);
