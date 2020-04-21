import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createTaskTemplate} from "./components/task.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createLoadBtnTemplate} from "./components/load-btn.js";


const TASK_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteWrapper = document.querySelector(`.main`);
const siteHeader = siteWrapper.querySelector(`.main__control`);

render(siteHeader, createSiteMenuTemplate(), `beforeend`);
render(siteWrapper, createFilterTemplate(), `beforeend`);
render(siteWrapper, createBoardTemplate(), `beforeend`);

const TaskContainer = siteWrapper.querySelector(`.board__tasks`);

render(TaskContainer, createTaskEditTemplate(), `beforeend`);

new Array(TASK_COUNT).fill(``).forEach(() => {
  render(TaskContainer, createTaskTemplate(), `beforeend`);
});

const contentWrapper = siteWrapper.querySelector(`.board.container`);
render(contentWrapper, createLoadBtnTemplate(), `beforeend`);
