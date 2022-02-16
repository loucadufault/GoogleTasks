import * as coda from "@codahq/packs-sdk";


type FetchCallback = (pageToken: string) => Promise<coda.FetchResponse>;


// should be an externally provided dependency of this module
function extractNextPageToken(response: coda.FetchResponse): string | undefined {
  return response.body.nextPageToken;
}


export function pager(initialResponse: coda.FetchResponse, fetchPage: FetchCallback) {
  class Page {
    public response: coda.FetchResponse;
    private nextPageToken: string | undefined;

    constructor(response: coda.FetchResponse) {
      this.response = response;
      this.nextPageToken = extractNextPageToken(response);
    }

    hasNextPage() {
      return this.nextPageToken !== undefined && this.nextPageToken !== "";
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
