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

    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
  }

  render(tasks) {
    const renderLoadMoreBtn = () => {
      if (showingTaskCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

      this._loadMoreBtnComponent.setClickHandler(() => {
        const prevTaskCount = showingTaskCount;
        showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;

        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTaskCount, showingTaskCount);

        renderTasks(taskListElement, sortedTasks);

        if (showingTaskCount >= tasks.length) {
          remove(this._loadMoreBtnComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTaskIsArchived = tasks.every((task) => task.isArchive);

    if (isAllTaskIsArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTaskCount));

    renderLoadMoreBtn();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTaskCount = SHOWING_TASK_COUNT_ON_START;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTaskCount);
      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);

      renderLoadMoreBtn();
    });
  }
}
