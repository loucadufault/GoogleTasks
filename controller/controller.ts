import * as coda from "@codahq/packs-sdk";

import { listTasklists, getTasklist } from "../service/tasklists.service";
import { listTasks, getTask, insertTask, patchTask, deleteTask as deleteTaskService } from "../service/tasks.service";


const MAX_PAGES = 5; // should be connected to coda rate limiting or pull from some rate limiting constants


async function tasklists(context: coda.ExecutionContext) {
  try {
    const items = [];
    let page = await listTasklists()(context.fetcher);
    let num_requests = 1;

    do {
      items.push(...page.response.body.items);

      if (!page.hasNextPage()) { break; }

      page = await page.fetchNextPage();

      num_requests++;
    } while (num_requests < MAX_PAGES);

    return items;
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
    const items = [];
    let page = await listTasks({ tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden })(context.fetcher);
    let num_requests = 1;

    do {
      items.push(...page.response.body.items);

      if (!page.hasNextPage()) { break; }

      page = await page.fetchNextPage();

      num_requests++;
    } while (num_requests < MAX_PAGES);

    return items;
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

async function task([tasklist, task]: [tasklist: string, task: string], context: coda.ExecutionContext) {
  try {
    const response = await getTask({ task, tasklist })(context.fetcher);
    return response.body; //.resource; API defect? see https://issuetracker.google.com/issues/219992957 
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

async function createTask([tasklist, title, notes, status, due]: [tasklist: string, title: string, notes: string, status: string, due: Date], context: coda.ExecutionContext) {
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
async function updateTask([tasklist, task, title, notes, status, due]: [tasklist: string, task: string, title: string, notes: string, status: string, due: Date], context: coda.ExecutionContext) {
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

async function deleteTask([tasklist, task]: [tasklist: string, task: string], context: coda.ExecutionContext) {
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
