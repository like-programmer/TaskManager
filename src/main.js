import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import BoardComponent from "./components/board.js";
import SortComponent from "./components/sort.js";
import TasksComponent from "./components/tasks.js";
import TaskComponent from "./components/task.js";
import TaskEditComponent from "./components/task-edit.js";
import LoadMoreBtnComponent from "./components/load-more-btn.js";

import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";

import {RenderPosition, render} from "./utils.js";


const TASK_COUNT = 21;
const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const onEditBtnClick = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const editBtn = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editBtn.addEventListener(`click`, onEditBtnClick);

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTaskCount = SHOWING_TASK_COUNT_ON_START;
  tasks.slice(0, showingTaskCount).forEach((task) => {
    renderTask(taskListElement, task);
  });

  const loadMoreBtnComponent = new LoadMoreBtnComponent();
  render(boardComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreBtnComponent.getElement().addEventListener(`click`, () => {
    const prevTaskCount = showingTaskCount;
    showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;

    tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
      renderTask(taskListElement, task);
    });

    if (showingTaskCount >= tasks.length) {
      loadMoreBtnComponent.getElement().remove();
      loadMoreBtnComponent.removeElement();
    }
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
