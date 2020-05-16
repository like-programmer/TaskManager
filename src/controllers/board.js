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

        tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
          renderTask(taskListElement, task);
        });

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
    tasks.slice(0, showingTaskCount).forEach((task) => {
      renderTask(taskListElement, task);
    });

    renderLoadMoreBtn();

    this._sortComponent.setSortTypeChangeHandler(() => {
      showingTaskCount = SHOWING_TASK_COUNT_ON_START;
      taskListElement.innerHTML = ``;

      tasks.slice(0, showingTaskCount).forEach((task) => {
        renderTask(taskListElement, task);
      });

      renderLoadMoreBtn();
    });
  }
}
