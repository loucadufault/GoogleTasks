type BasePaginatableResponse<T> = {
  kind: string,
  etag: string,
  nextPageToken?: string,
  items: T[]
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
  ]
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
