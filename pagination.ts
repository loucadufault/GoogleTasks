import * as coda from "@codahq/packs-sdk";


type FetchCallback = (pageToken: string) => Promise<coda.FetchResponse>;


// should be an externally provided dependency of this module
function extractNextPageToken(response: coda.FetchResponse): string {
  return response.body.nextPageToken;
}


class Page {
  public readonly index: number;
  public readonly response: coda.FetchResponse;
  public readonly nextPageToken: string;

  constructor(index: number, response: coda.FetchResponse, nextPageToken: string) {
    this.index = index;
    this.response = response;
    this.nextPageToken = nextPageToken;
  }
}


export function paginator(initialResponse: coda.FetchResponse, fetchPage: FetchCallback) {
  class Pager {
    private currentPage: Page;

    constructor(initialResponse: coda.FetchResponse) {
      this.currentPage = new Page(0, initialResponse, extractNextPageToken(initialResponse));
    }

    getCurrentPage() {
      return this.currentPage;
    }

    hasNextPage() {
      return this.currentPage.nextPageToken !== undefined && this.currentPage.nextPageToken !== "";
    }

    async nextPage() {
      if (!this.hasNextPage()) {
        return null;
      }

      const nextResponse = await fetchPage(this.currentPage.nextPageToken);
      this.currentPage = new Page(this.currentPage.index + 1, nextResponse, extractNextPageToken(nextResponse));
      return this.currentPage;
    }
  }

  return new Pager(initialResponse);
}
