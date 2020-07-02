export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    return this._api.getTasks();
  }

  createTask(task) {
    this._api.createTask(task);
  }

  updateTask(id, task) {
    this._api.updateTask(id, task);
  }

  deleteTask(id) {
    this._api.deleteTask(id);
  }
}
