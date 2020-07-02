const isOnLine = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    if (isOnLine()) {
      return this._api.getTasks();
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  createTask(task) {
    if (isOnLine()) {
      return this._api.createTask(task);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  updateTask(id, task) {
    if (isOnLine()) {
      return this._api.updateTask(id, task);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  deleteTask(id) {
    if (isOnLine()) {
      return this._api.deleteTask(id);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }
}
