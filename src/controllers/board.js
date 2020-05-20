import SortComponent, {SortType} from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks.js";
import LoadMoreBtnComponent from "../components/load-more-btn.js";

import TaskController from "./task.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;

    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;

    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showingTaskCount = SHOWING_TASK_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;

    const container = this._container.getElement();
    const isAllTaskIsArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTaskIsArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    renderTasks(taskListElement, tasks.slice(0, this._showingTaskCount));

    this._renderLoadMoreBtn();
  }

  _renderLoadMoreBtn() {
    if (this._showingTaskCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTaskCount = this._showingTaskCount;
      this._showingTaskCount = this._showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;
      const taskListElement = this._tasksComponent.getElement();

      // const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTaskCount, showingTaskCount);

      renderTasks(taskListElement, sortedTasks.slice(0, this._showingTaskCount));

      if (this._showingTaskCount >= this._tasks.length) {
        remove(this._loadMoreBtnComponent);
      }
    });
  }

  _onSortTypeChange() {
    this._showingTaskCount = SHOWING_TASK_COUNT_ON_START;

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTaskCount);
    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    renderTasks(taskListElement, sortedTasks);

    this._renderLoadMoreBtn();
  }
}
