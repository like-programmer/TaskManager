import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import BoardComponent from "./components/board.js";

import TasksModel from "./models/tasks.js";

import BoardController from "./controllers/board.js";

import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";

import {RenderPosition, render} from "./utils/render.js";


const TASK_COUNT = 21;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);
const filters = generateFilters(tasks);

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
