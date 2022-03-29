import * as coda from "@codahq/packs-sdk";
import { TaskListRESTResource, TaskRESTResource } from "../api_response.types";

import { listTasklists, getTasklist } from "../service/tasklists.service";
import { listTasks, getTask, insertTask, patchTask, deleteTask as deleteTaskService } from "../service/tasks.service";


const MAX_PAGES = 5; // should be connected to coda rate limiting or pull from some rate limiting constants


async function tasklists(context: coda.ExecutionContext) {
  try {
    const items: TaskListRESTResource[] = [];
    const pager = await listTasklists()(context.fetcher);
    let num_requests = 1;

    do {
      items.push(...pager.getCurrentPage().response.body.items);

      if (!pager.hasNextPage()) { break; }

      await pager.nextPage();

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
    const items: TaskRESTResource[] = [];
    const pager = await listTasks({ tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden })(context.fetcher);
    let num_requests = 1;

    do {
      // see https://issuetracker.google.com/issues/227221663
      // not sure what the behaviour is for when this prop is or isn't present
      // for now let's be safe and not make any assumptions, check everytime before accessing the prop that is is present, regardless of page number
      // we do assume that if the items property is present, then it is a list of Task objects (and not some nonsense value)
      if (pager.getCurrentPage().response.body.hasOwnProperty("items")) {
        items.push(...pager.getCurrentPage().response.body.items);
      }

      if (!pager.hasNextPage()) { break; }

      await pager.nextPage();

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
    return response.body as TaskRESTResource; //.resource; API defect? see https://issuetracker.google.com/issues/219992957 
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
    return response.body.id as string; //.resource; API defect? see https://issuetracker.google.com/issues/219992957 
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
    return response.body.id as string; //.resource; API defect? see https://issuetracker.google.com/issues/219992957 
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
