import * as coda from "@codahq/packs-sdk";


type FetchCallback<T> = (pageToken: string) => Promise<coda.FetchResponse<T>>;


// should be an externally provided dependency of this module
function extractNextPageToken(response: coda.FetchResponse): string {
  return response.body.nextPageToken;
}


class Page<T> {
  public readonly index: number;
  public readonly response: coda.FetchResponse<T>;
  public readonly nextPageToken: string;

  constructor(index: number, response: coda.FetchResponse<T>, nextPageToken: string) {
    this.index = index;
    this.response = response;
    this.nextPageToken = nextPageToken;
  }
}


export function paginator<T>(initialResponse: coda.FetchResponse<T>, fetchPage: FetchCallback<T>) {
  class Pager {
    private currentPage: Page<T>;

    constructor(initialResponse: coda.FetchResponse<T>) {
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

      const nextResponse: coda.FetchResponse<T> = await fetchPage(this.currentPage.nextPageToken);
      this.currentPage = new Page(this.currentPage.index + 1, nextResponse, extractNextPageToken(nextResponse));
      return this.currentPage;
    }
  }

  return new Pager(initialResponse);
}
