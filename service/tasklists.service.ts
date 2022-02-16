import * as coda from "@codahq/packs-sdk";
import { pager } from "../pager";

import { BASE_URL } from "../utils/api.constants";
import { MAX_ALLOWED_MAX_RESULTS } from "../utils/pagination.constants";
import { fetchRequestAsIdentifierOrFallbackAsTitle } from "../utils/service.helpers";


const MAX_RESULTS = MAX_ALLOWED_MAX_RESULTS;


function listTasklists() {
  return async function(fetcher: coda.Fetcher) {
    const url = coda.withQueryParams(`${BASE_URL}/users/@me/lists`, { maxResults: MAX_RESULTS });
    
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

function getTasklist({ tasklist }: { tasklist: string }) {
  return async function(fetcher: coda.Fetcher) {
    const { response } = await fetchRequestAsIdentifierOrFallbackAsTitle(fetcher, tasklist, (tasklistIdentifier) => ({
      method: "GET",
      url: `${BASE_URL}/users/@me/lists/${tasklistIdentifier}`
    }));

    return response;
  }
}


export {
  listTasklists,
  getTasklist,
}
