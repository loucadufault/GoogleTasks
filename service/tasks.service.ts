import * as coda from "@codahq/packs-sdk";

import { BASE_URL } from "../utils/api.constants";
import { Task, Tasklist } from "../types";
import { pager } from "../pager";
import { MAX_ALLOWED_MAX_RESULTS } from "../utils/pagination.constants";
import { mayBeValidResourceIdentifier } from "../utils/api.helpers";
import { listTasklists } from "./tasklists.service";


const MAX_RESULTS = MAX_ALLOWED_MAX_RESULTS;


async function fetchRequestAsIdentifierOrFallbackAsTitle(fetcher: coda.Fetcher, tasklistIdentifier: string, buildFetchRequest: (tasklistIdentifier: string) => coda.FetchRequest) {
  let wasValidIdentifier = false;
  let response: coda.FetchResponse;
  let usedTasklistIdentifier: string;

  if (mayBeValidResourceIdentifier(tasklistIdentifier)) {
    usedTasklistIdentifier = tasklistIdentifier;

    response = await fetcher.fetch(buildFetchRequest(tasklistIdentifier));

    wasValidIdentifier = response.status !== 400; // unwise
  }

  if (!wasValidIdentifier) { // treat it as a title
    const tasklists = (await listTasklists()(fetcher)); // TODO: hack, let's assume for now that the taskslist fit on the first page
    
    const tasklistWithTitle = (tasklists.response.body.items as Tasklist[]).find((item: Tasklist) => item.title === tasklistIdentifier);
    
    usedTasklistIdentifier = tasklistWithTitle.id;

    response = await fetcher.fetch(buildFetchRequest(tasklistWithTitle.id));
  }

  return {
    tasklistIdentifier: usedTasklistIdentifier,
    response
  };
} 


function listTasks({ tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden }: { tasklist: string, dueMin: Date, dueMax: Date, completedMin: Date, completedMax: Date, updatedMin: Date, showCompleted: boolean, showDeleted: boolean, showHidden: boolean }) {
  return async function(fetcher: coda.Fetcher) {
    const buildUrl = (tasklistIdentifier: string) => 
      coda.withQueryParams(
        `${BASE_URL}/lists/${tasklistIdentifier}/tasks`, 
        JSON.parse(JSON.stringify({ // stringify dates to ISO strings and filter out undefined props
          dueMin,
          dueMax,
          completedMin,
          completedMax,
          updatedMin,
          showCompleted,
          showDeleted,
          showHidden,
          maxResults: MAX_RESULTS
        })));

    const { tasklistIdentifier, response: initialResponse } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "GET",
      url: buildUrl(tasklistIdentifier), 
    }));

    return pager(initialResponse, (pageToken) => {
      const nextPageUrl = coda.withQueryParams(buildUrl(tasklistIdentifier), { pageToken });

      return fetcher.fetch({
        method: "GET",
        url: nextPageUrl,
      });
    }); // initial page
  }
}

function getTask({ tasklist, task }: { tasklist: string, task: string }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "GET",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks/${task}`, 
    }));

    return response;
  }
}

function insertTask({ tasklist, taskResource }: {tasklist: string, taskResource: Task }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "POST",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks`,
      body: JSON.stringify(taskResource),
    }));

    return response;
  }
}

function patchTask({ tasklist, task, taskResource }: {tasklist: string, task: string, taskResource: Task }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "PATCH",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks/${task}`,
      body: JSON.stringify(taskResource),
    }));

    return response;
  }
}

function deleteTask({ tasklist, task }: { tasklist: string, task: string }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "DELETE",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks/${task}`
    }));

    return response;
  }
}


export {
  listTasks,
  getTask,
  insertTask,
  patchTask,
  deleteTask,
}
