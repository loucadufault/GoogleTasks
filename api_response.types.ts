type BasePaginatableResponse<T> = {
  kind: string,
  etag: string,
  nextPageToken?: string,
  items?: T[] // making this optional is weirdly not enough to get VSCode to notice that we are missing some checks to narrow down the type (i.e. assert prop is present and iterable), should add a TS-lint script to fully exercise the typings... TODO
}

// because of issue https://issuetracker.google.com/issues/219992957 , the REST resource representation objects are not actually nested under a resource field, and are instead directly at the top level
// if/when that changes, the types exported from here for the XRESTResource should be wrapped in this and called XResponse
type BaseResourceResponse<T> = {
  resource: T
}

type TaskListRESTResource = {
  kind: string,
  id: string,
  etag: string,
  title: string,
  updated: string,
  selfLink: string
}

type TaskRESTResource = {
  kind: string,
  id: string,
  etag: string,
  title: string,
  updated: string,
  selfLink: string,
  parent: string,
  position: string,
  notes: string,
  status: string,
  due: string,
  completed: string,
  deleted: boolean,
  hidden: boolean,
  links: [
    {
      type: string,
      description: string,
      link: string
    }
  ] // bug here, this should be an array of objects, not an array with one object TODO
}

type TasksResponse = BasePaginatableResponse<TaskRESTResource>;
type TaskListsResponse = BasePaginatableResponse<TaskListRESTResource>;

type EmptyResponse = {};

export {
  TaskRESTResource,
  TasksResponse,
  TaskListRESTResource,
  TaskListsResponse,
  EmptyResponse,
}
