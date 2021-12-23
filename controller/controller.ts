import * as coda from "@codahq/packs-sdk";

import { listTasklists, getTasklist } from "../service/tasklists.service";
import { listTasks, getTask, insertTask, patchTask, deleteTask as deleteTaskService } from "../service/tasks.service";


async function tasklists(context: coda.ExecutionContext) {
  try {
    const response = await listTasklists()(context.fetcher);
    return response.body;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}

async function tasklist([tasklist]: [tasklist: string], context: coda.ExecutionContext) {
  try {
    const response = await getTasklist({ tasklist })(context.fetcher);
    return response.body;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}

async function tasks(
  [tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden]: [tasklist: string, dueMin: Date, dueMax: Date, completedMin: Date, completedMax: Date, updatedMin: Date, showCompleted: boolean, showDeleted: boolean, showHidden: boolean], 
  context: coda.ExecutionContext) {
  try {
    const response = await listTasks({ tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden })(context.fetcher);
    return response.body.resource.items;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}

async function task([task, tasklist]: [task: string, tasklist: string], context: coda.ExecutionContext) {
  try {
    const response = await getTask({ task, tasklist })(context.fetcher);
    return response.body.resource;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}

async function createTask([title, notes, status, due, tasklist]: [title: string, notes: string, status: string, due: Date, tasklist: string], context: coda.ExecutionContext) {
  try {
    const response = await insertTask({ tasklist, taskResource: { title, notes, status, due } })(context.fetcher);
    return response.body.resource.id;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}

// can the task list itself be updated here? newTaskList? explore api
async function updateTask([task, title, notes, status, due, tasklist]: [task: string, title: string, notes: string, status: string, due: Date, tasklist: string], context: coda.ExecutionContext) {
  try {
    const response = await patchTask({ task, tasklist, taskResource: { title, notes, status, due } })(context.fetcher);
    return response.body.resource.id;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}

async function deleteTask([task, tasklist]: [task: string, tasklist: string], context: coda.ExecutionContext) {
  try {
    await deleteTaskService({ tasklist, task })(context.fetcher);
    return;
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      let statusError = error as coda.StatusCodeError;
      // If the API returned an error message in the body, show it to the user.
      let message = statusError.body?.message;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    // The request failed for some other reason. Re-throw the error so that it bubbles up.
    throw error;
  }
}


export {
  tasklists,
  tasklist,
  tasks,
  task,
  createTask,
  updateTask,
  deleteTask,
}
