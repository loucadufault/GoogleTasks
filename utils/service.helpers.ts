import * as coda from "@codahq/packs-sdk";

import { listTasklists } from "../service/tasklists.service";
import { Tasklist } from "../types";
import { mayBeValidResourceIdentifier } from "./api.helpers";

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
    
    if (tasklistWithTitle !== undefined) {
      usedTasklistIdentifier = tasklistWithTitle.id;

      response = await fetcher.fetch(buildFetchRequest(tasklistWithTitle.id));
    }
  }

  return {
    tasklistIdentifier: usedTasklistIdentifier,
    response
  };
}

export {
  fetchRequestAsIdentifierOrFallbackAsTitle,
}
