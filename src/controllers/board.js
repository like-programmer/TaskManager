import SortComponent from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks.js";
import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";
import LoadMoreBtnComponent from "../components/load-more-btn.js";

import {RenderPosition, render, replace, remove} from "../utils/render.js";

const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeydown = (evt) => {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;

    if (isEsc) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeydown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  taskComponent.setEditBtnClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeydown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeydown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTaskIsArchived = tasks.every((task) => task.isArchive);

  if (isAllTaskIsArchived) {
    render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTaskCount = SHOWING_TASK_COUNT_ON_START;
  tasks.slice(0, showingTaskCount).forEach((task) => {
    renderTask(taskListElement, task);
  });

  const loadMoreBtnComponent = new LoadMoreBtnComponent();
  render(boardComponent.getElement(), loadMoreBtnComponent, RenderPosition.BEFOREEND);

  loadMoreBtnComponent.setClickHandler(() => {
    const prevTaskCount = showingTaskCount;
    showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;

    tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
      renderTask(taskListElement, task);
    });

    if (showingTaskCount >= tasks.length) {
      remove(loadMoreBtnComponent);
    }
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;
  }

  render(tasks) {
    renderBoard(this._container, tasks);
  }
}
