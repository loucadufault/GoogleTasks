import * as coda from "@codahq/packs-sdk";

import { BASE_URL } from "../utils/constants.helpers";

function listTasklists() {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "GET",
      url: `${BASE_URL}/users/@me/lists`
    });
  }
}

function getTasklist({ tasklist }: { tasklist: string }) {
  return async function(fetcher: coda.Fetcher) {
    return await fetcher.fetch({
      method: "GET",
      url: `${BASE_URL}/users/@me/lists/${tasklist}`
    });
  }
}

export {
  listTasklists,
  getTasklist,
}