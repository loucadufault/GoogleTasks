import * as coda from "@codahq/packs-sdk";

import { listTasklists } from "../service/tasklists.service";
import { Tasklist } from "../types";
import { mayBeValidResourceIdentifier } from "./api.helpers";

/**
 * Use a strategy to make the fetch requests built using the given (tentative) tasklist identifier. This strategy aims to support providing a valid tasklist identifier or the title of a tasklist as the formula "tasklist" param.
 * 
 * All fetch operations use the given fetcher object and rely on the buildFetchRequest callback to supply a valid FetchRequest object from a supplied tasklist identifier.  
 * The function is guaranteed to perform at least one fetch operation and return a response.
 * 
 * Strategy:
 * 1. First check if the given tasklist identifier is obviously not a valid resource identifier. If it is not determined to be invalid, perform 2., otherwise perform 3..
 * 2. Perform the fetch operation with the given tasklist identifier. If the response status is an error (equals 400), then perform 3., otherwise return the response.
 * 3. Search all* existing tasklists to attempt to find** the first one*** where the title matches the given tasklist identifier. If such a tasklist is found, perform 4., otherwise perform 5..
 * 4. Perform the fetch operation with the identifier of the found tasklist match and return the response.
 * 5. Perform the fetch operation with the given tasklist identifier. Return the response regardless of whether it is successful.
 * 
 * \* For now, we only search the first page of tasklists, as returned by the listTasklists of the tasklists service module.  
 * \** The match must be exact, i.e. same punctuation, whitespace, case, etc..  
 * \*** The results are sorted arbitrarily according to order returned by the API endpoint by default.  
 * 
 * @todo check whether multiple tasklists have title that match the given input (assuming duplicates are allowed). If so, return a custom error.
 * 
 * @param fetcher 
 * @param tasklistIdentifier 
 * @param buildFetchRequest 
 * @returns asynchronously an object comprising the response object and the tasklistIdentifier ultimately selected according to the strategy.
 */
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
    } else if (response === undefined) { // most likely isn't a valid tasklist identifier (and definitely not the title of any tasklist)
      // make the request anyway to return a meaningful error payload
      usedTasklistIdentifier = tasklistIdentifier;

      response = await fetcher.fetch(buildFetchRequest(tasklistIdentifier));
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
