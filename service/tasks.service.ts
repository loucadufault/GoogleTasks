import * as coda from "@codahq/packs-sdk";

import { BASE_URL } from "../utils/api.constants";
import { Task } from "../types";
import { pager } from "../pager";
import { MAX_ALLOWED_MAX_RESULTS } from "../utils/pagination.constants";


const MAX_RESULTS = MAX_ALLOWED_MAX_RESULTS;


function listTasks({ tasklist, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden }: { tasklist: string, dueMin: Date, dueMax: Date, completedMin: Date, completedMax: Date, updatedMin: Date, showCompleted: boolean, showDeleted: boolean, showHidden: boolean }) {
  return async function(fetcher: coda.Fetcher) {
    let url = coda.withQueryParams(
      `${BASE_URL}/lists/${tasklist}/tasks`, 
      JSON.parse(JSON.stringify({ // stringify dates to ISO strings and filter out undefined props
        dueMin,
        dueMax,
        completedMin,
        completedMax,
        updatedMin,
        showCompleted,
        showDeleted,
        showHidden
      }))
    );

    url = coda.withQueryParams(url, { maxResults: MAX_RESULTS });
    
    const initialResponse = await fetcher.fetch({
      method: "GET",
      url,
    });

    return pager(initialResponse, (pageToken) => {
      const nextPageUrl = coda.withQueryParams(url, { pageToken });

      return fetcher.fetch({
        method: "GET",
        url: nextPageUrl,
      });
    }); // initial page
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
