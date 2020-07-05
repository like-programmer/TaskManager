import SortComponent, {SortType} from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import NoTasksComponent from "../components/no-tasks.js";
import LoadMoreBtnComponent from "../components/load-more-btn.js";

import TaskController, {Mode as TaskControllerMode, EmptyTask} from "./task.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, dataChangeHandler, viewChangeHandler) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, dataChangeHandler, viewChangeHandler);
    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
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
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;

    this._showedTaskControllers = [];
    this._showingTaskCount = SHOWING_TASK_COUNT_ON_START;
    this._creatingTask = null;

    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._loadMoreBtnClickHandler = this._loadMoreBtnClickHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._tasksModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    const isAllTaskIsArchived = tasks.every((task) => task.isArchive);

    if (isAllTaskIsArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTaskCount));

    this._renderLoadMoreBtn();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    if (this._tasksModel.getTasks().length === 0) {
      const containerElement = this._container.getElement();
      render(containerElement, this._sortComponent, RenderPosition.BEFOREEND);
      render(containerElement, this._tasksComponent, RenderPosition.BEFOREEND);
      remove(this._noTasksComponent);
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._dataChangeHandler, this._viewChangeHandler);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._dataChangeHandler, this._viewChangeHandler);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTaskCount = this._showedTaskControllers.length;
  }

  _renderLoadMoreBtn() {
    remove(this._loadMoreBtnComponent);

    if (this._showingTaskCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);
    this._loadMoreBtnComponent.setClickHandler(this._loadMoreBtnClickHandler);
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreBtn();
  }

  _dataChangeHandler(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      // DELETING UNSAVED NEW TASK
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTaskCount);

        if (this._tasksModel.getTasks().length === 0) {
          const containerElement = this._container.getElement();
          remove(this._sortComponent);
          remove(this._tasksComponent);
          render(containerElement, this._noTasksComponent, RenderPosition.BEFOREEND);
        }
        // CREATING
      } else {
        this._api.createTask(newData)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            taskController.render(taskModel, TaskControllerMode.DEFAULT);

            if (this._showingTaskCount % SHOWING_TASK_COUNT_BY_BUTTON === 0) {
              const destroyedTask = this._showedTaskControllers.pop();
              destroyedTask.destroy();
            }

            this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
            this._showingTaskCount = this._showedTaskControllers.length;

            this._renderLoadMoreBtn();
          })
          .catch(() => {
            taskController.shake();
          });
      }
      // DELETING
    } else if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          this._updateTasks(this._showingTaskCount);
        });
      // UPDATING
    } else {
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTasks(this._showingTaskCount);
          }
        })
        .catch(() => {
          taskController.shake();
        });
    }
  }

  _viewChangeHandler() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _sortTypeChangeHandler(sortType) {
    this._showingTaskCount = SHOWING_TASK_COUNT_ON_START;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTaskCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadMoreBtn();
  }

  _loadMoreBtnClickHandler() {
    const prevTaskCount = this._showingTaskCount;
    const tasks = this._tasksModel.getTasks();
    this._showingTaskCount = this._showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTON;
    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTaskCount, this._showingTaskCount);
    this._renderTasks(sortedTasks);

    if (this._showingTaskCount >= sortedTasks.length) {
      remove(this._loadMoreBtnComponent);
    }
  }

  _filterChangeHandler() {
    this._updateTasks(SHOWING_TASK_COUNT_ON_START);
  }
}
