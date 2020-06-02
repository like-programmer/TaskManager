import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";

import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {COLOR} from "../const";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavourite: false,
  isArchive: false,
  tags: [],
};

export default class TaskController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._mode = Mode.DEFAULT;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditBtnClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._taskComponent.setArchiveBtnClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavouriteBtnClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isFavourite: !task.isFavourite,
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._dataChangeHandler(this, task, data);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });
    this._taskEditComponent.setDeleteBtnClickHandler(() => this._dataChangeHandler(this, task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldTaskEditComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskComponent && oldTaskEditComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }

        document.addEventListener(`keydown`, this._escKeyDownHandler);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceTaskToEdit() {
    this._viewChangeHandler();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (this._mode === Mode.ADDING) {
      this._dataChangeHandler(this, EmptyTask, null);
    }

    const isEsc = evt.key === `Escape` || evt.key === `Esc`;

    if (isEsc) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
