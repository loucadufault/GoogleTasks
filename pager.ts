import * as coda from "@codahq/packs-sdk";


type FetchCallback = (pageToken: string) => Promise<coda.FetchResponse>;


function extractNextPageToken(response: coda.FetchResponse) {
  return response.body.nextPageToken as string;
}


export function pager(initialResponse: coda.FetchResponse, fetchPage: FetchCallback) {
  class Page {
    public response: coda.FetchResponse;
    private nextPageToken: string;

    constructor(response: coda.FetchResponse) {
      this.response = response;
      this.nextPageToken = extractNextPageToken(response);
    }

    hasNextPage() {
      return this.nextPageToken !== "";
    }

    async fetchNextPage() {
      if (!this.hasNextPage()) {
        return null;
      }

      const nextPageResponse = await fetchPage(this.nextPageToken);
      return new Page(nextPageResponse);
    }
  }

  return new Page(initialResponse);
}
