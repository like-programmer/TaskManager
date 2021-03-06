import Task from "../models/task.js";
import {nanoid} from "nanoid";

const isOnLine = () => {
  return window.navigator.onLine;
};

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success).map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (isOnLine()) {
      return this._api.getTasks()
        .then((tasks) => {
          const items = createStoreStructure(tasks.map((task) => task.toRAW()));

          this._store.setItems(items);

          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());
    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  createTask(task) {
    if (isOnLine()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    // In case if internet is unavailable, we must create an `id`.
    const localNewTaskId = nanoid();
    const localNewTask = Task.clone(Object.assign(task, {id: localNewTaskId}));

    this._store.setItem(localNewTask.id, localNewTask.toRAW());

    return Promise.resolve(localNewTask);
  }

  updateTask(id, task) {
    if (isOnLine()) {
      return this._api.updateTask(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localTask = Task.clone(Object.assign(task, {id}));

    this._store.setItem(id, localTask.toRAW());

    return Promise.resolve(localTask);
  }

  deleteTask(id) {
    if (isOnLine()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnLine()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // pick up synced tasks from answer
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          // add synced tasks to the storage
          // storage must be relevant in each moment
          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
