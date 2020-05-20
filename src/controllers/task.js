import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";

import {RenderPosition, render, replace} from "../utils/render.js";

export default class TaskController {
  constructor(container) {
    this._container = container;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditBtnClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveBtnClickHandler(() => {});
    this._taskComponent.setFavouriteBtnClickHandler(() => {});

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToEdit() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _onEscKeyDown(evt) {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;

    if (isEsc) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
