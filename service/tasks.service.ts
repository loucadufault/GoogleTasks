import * as coda from "@codahq/packs-sdk";

import { BASE_URL } from "../utils/constants.helpers";
import { Task } from "../types";

function listTasks({ tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden }: { tasklist: string, dueMin: Date, dueMax: Date, completedMin: Date, completedMax: Date, updatedMin: Date, showCompleted: boolean, showDeleted: boolean, showHidden: boolean }) {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "GET",
      url: `${BASE_URL}/lists/${tasklist}/tasks`
    });
  }
}

function getTask({ tasklist, task }: { tasklist: string, task: string }) {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "GET",
      url: `${BASE_URL}/lists/${tasklist}/tasks/${task}`
    });
  }
}

function insertTask({ tasklist, taskResource }: {tasklist: string, taskResource: Task }) {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "POST",
      url: `${BASE_URL}/lists/${tasklist}/tasks`,
      body: JSON.stringify(taskResource),
    });
  }
}

function patchTask({ tasklist, task, taskResource }: {tasklist: string, task: string, taskResource: Task }) {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "PATCH",
      url: `${BASE_URL}/lists/${tasklist}/tasks/${task}`,
      body: JSON.stringify(taskResource),
    });
  }
}

function deleteTask({ tasklist, task }: { tasklist: string, task: string }) {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "DELETE",
      url: `${BASE_URL}/lists/${tasklist}/tasks/${task}`
    });
  }
}

export {
  listTasks,
  getTask,
  insertTask,
  patchTask,
  deleteTask,
}