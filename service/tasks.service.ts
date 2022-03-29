import * as coda from "@codahq/packs-sdk";

import { BASE_URL } from "../utils/api.constants";
import { Task } from "../types";
import { paginator } from "../pagination";
import { MAX_ALLOWED_MAX_RESULTS } from "../utils/pagination.constants";
import { fetchRequestAsIdentifierOrFallbackAsTitle } from "../utils/service.helpers";
import { EmptyResponse, TaskRESTResource, TasksResponse } from "../api_response.types";


const MAX_RESULTS = MAX_ALLOWED_MAX_RESULTS;


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

    return paginator<TasksResponse>(initialResponse, (pageToken) => {
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

    return response as coda.FetchResponse<TaskRESTResource>;
  }
}

function insertTask({ tasklist, taskResource }: {tasklist: string, taskResource: Task }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "POST",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks`,
      body: JSON.stringify(taskResource),
    }));

    return response as coda.FetchResponse<TaskRESTResource>;
  }
}

function patchTask({ tasklist, task, taskResource }: {tasklist: string, task: string, taskResource: Task }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "PATCH",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks/${task}`,
      body: JSON.stringify(taskResource),
    }));

    return response as coda.FetchResponse<TaskRESTResource>;
  }
}

function deleteTask({ tasklist, task }: { tasklist: string, task: string }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "DELETE",
      url: `${BASE_URL}/lists/${tasklistIdentifier}/tasks/${task}`
    }));

    return response as coda.FetchResponse<EmptyResponse>;
  }
}


export {
  listTasks,
  getTask,
  insertTask,
  patchTask,
  deleteTask,
}
