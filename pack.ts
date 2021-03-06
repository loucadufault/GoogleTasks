import * as coda from "@codahq/packs-sdk";

import 'dotenv/config';

import { tasklists, tasklist, tasks, task, createTask, updateTask, deleteTask } from "./controller/controller";
import { syncTableTaskSchema, tasklistSchema, taskSchema } from "./schemas";
import { Task } from "./types";
import { GOOGLEAPIS_DOMAIN } from "./utils/api.constants";
import { CACHE_TTL } from "./utils/pack.constants";


export const pack = coda.newPack();


// per-user authentication
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth", // see https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
  tokenUrl: "https://oauth2.googleapis.com/token", // see https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
  scopes: [
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/tasks.readonly"
  ],
  additionalParams: {
    access_type: "offline",
    prompt: "consent",
  },
});


pack.addNetworkDomain(GOOGLEAPIS_DOMAIN);


const tasklistParam = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "tasklist",
  description: "The URL, ID, or title of a task list to use.",
  autocomplete: async function (context, search) {
    const results = await tasklists(context);
    // Generate an array of autocomplete objects, using the task list's name as the label and its id for the value.
    return coda.autocompleteSearchObjects(search, results, "title", "id");
  },
});

const taskParam = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "task",
  description: "The URL or ID of a task."
});


// 
pack.addFormula({
  name: "Tasklists",
  description: "Returns all task lists.",
  cacheTtlSecs: CACHE_TTL,

  parameters: [],

  resultType: coda.ValueType.Array,
  items: tasklistSchema,

  execute: async function ([], context) {
    return tasklists(context); //taskLists(context);
  },
});

// 
pack.addFormula({
  name: "Tasklist",
  description: "Returns a specific task list.",
  cacheTtlSecs: CACHE_TTL,

  parameters: [
    tasklistParam
  ],

  resultType: coda.ValueType.Object,
  schema: tasklistSchema,

  execute: async function ([pTasklist = "primary"], context) {
    return tasklist([pTasklist], context); //taskLists(context);
  },
});

// 
pack.addFormula({
  name: "Tasks",
  description: "Returns all tasks in the specified task list.",
  cacheTtlSecs: CACHE_TTL,

  parameters: [
    tasklistParam,
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "dueMin",
      description: "Lower bound for a task's due date to filter by. The default is not to filter by due date.",
      optional: true,    
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "dueMax",
      description: "Upper bound for a task's due date to filter by. The default is not to filter by due date.",
      optional: true,    
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "completedMin",
      description: "Lower bound for a task's completion date to filter by. The default is not to filter by completion date.",
      optional: true,    
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "completedMax",
      description: "Upper bound for a task's completion date to filter by. The default is not to filter by completion date.",
      optional: true,    
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "updatedMin",
      description: "Lower bound for a task's last modification time to filter by. The default is not to filter by last modification time.",
      optional: true,    
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "showCompleted",
      description: "Flag indicating whether completed tasks are returned in the result. The default is True. Note that `showHidden` must also be True to show tasks completed in first party clients, such as the web UI and Google's mobile apps.",
      optional: true,
      // suggestedValue: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "showDeleted",
      description: "Flag indicating whether deleted tasks are returned in the result. The default is False.",
      optional: true,
      // suggestedValue: false,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "showHidden",
      description: "Flag indicating whether hidden tasks are returned in the result. The default is False.",
      optional: true,
      // suggestedValue: false,
    }),
  ],

  resultType: coda.ValueType.Array,
  items: taskSchema,

  execute: async function ([taskList = "primary", dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted = true, showDeleted = false, showHidden = false], context) {
    return tasks([ taskList, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden ], context);
  }
});

pack.addFormula({
  name: "Task",
  description: "Returns the specified task.",
  cacheTtlSecs: CACHE_TTL,

  parameters: [
    tasklistParam,
    taskParam,
  ],

  resultType: coda.ValueType.Object,
  schema: taskSchema,

  execute: async function ([taskList = "primary", pTask], context) {
    return task([taskList, pTask], context);
  }
});

// 
pack.addFormula({
  name: "CreateTask",
  description: "Creates a new task on the specified task list.",

  isAction: true,

  parameters: [
    tasklistParam,
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "Title of the task."
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "notes",
      description: "Notes describing the task.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "status",
      description: `Status of the task. This is either "needsAction" or "completed".`,
      autocomplete: ["needsAction", "completed"],
      optional: true,
      suggestedValue: "needsAction",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "due",
      description: "Due date of the task. The due date only records date information; the time portion of the timestamp is discarded when setting the due date.",
      optional: true,
    }),
    // completed and deleted params?
  ],
  // these seem to be read-only
  // varargParameters: [
  //   coda.makeParameter({
  //     type: coda.ParameterType.String,
  //     name: "linkType",
  //     description: `Type of the link, e.g. "email".`,
  //     autocomplete: ["email"] // explore API to discover others
  //   }),
  //   coda.makeParameter({
  //     type: coda.ParameterType.String,
  //     name: "linkDescription",
  //     description: "The description. In HTML speak: Everything between <a> and </a>."
  //   }),
  //   coda.makeParameter({
  //     type: coda.ParameterType.String,
  //     name: "link",
  //     description: "The URL"
  //   }),
  // ],

  resultType: coda.ValueType.String,

  execute: async function ([taskList = "primary", title, notes, status, due], context) {
    return createTask([taskList, title, notes, status, due], context);
  },
});

// 
pack.addFormula({
  name: "UpdateTask",
  description: "Updates the specified task.",

  isAction: true,

  parameters: [
    tasklistParam,
    taskParam,
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "Title of the task."
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "notes",
      description: "Notes describing the task.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "status",
      description: `Status of the task. This is either "needsAction" or "completed".`,
      autocomplete: ["needsAction", "completed"],
      optional: true,
      suggestedValue: "needsAction",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "due",
      description: "Due date of the task. The due date only records date information; the time portion of the timestamp is discarded when setting the due date.",
      optional: true,
    }),
    // completed and deleted params?
  ],
  // these seem to be read-only
  // varargParameters: [
  //   coda.makeParameter({
  //     type: coda.ParameterType.String,
  //     name: "linkType",
  //     description: `Type of the link, e.g. "email".`,
  //     autocomplete: ["email"] // explore API to discover others
  //   }),
  //   coda.makeParameter({
  //     type: coda.ParameterType.String,
  //     name: "linkDescription",
  //     description: "The description. In HTML speak: Everything between <a> and </a>."
  //   }),
  //   coda.makeParameter({
  //     type: coda.ParameterType.String,
  //     name: "link",
  //     description: "The URL"
  //   }),
  // ],

  resultType: coda.ValueType.String,

  execute: async function ([tasklist = "primary", task, title, notes, status, due], context) {
    return updateTask([tasklist, task, title, notes, status, due], context);
  },
});

// 
pack.addFormula({
  name: "DeleteTask",
  description: "Deletes the specified task from the task list.",

  isAction: true,

  parameters: [
    tasklistParam,
    taskParam
  ],

  resultType: coda.ValueType.String,

  execute: async function ([tasklist = "primary", task], context) {
    deleteTask([tasklist, task], context);
    return "OK";
  },
});

pack.addSyncTable({
  name: "Tasks",
  schema: syncTableTaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync the user's tasks",
    cacheTtlSecs: 0, /** @see https://coda.io/packs/build/latest/guides/blocks/sync-tables/#caching */
    parameters: [
      tasklistParam,
      coda.makeParameter({
        type: coda.ParameterType.Date,
        name: "dueMin",
        description: "Lower bound for a task's due date to filter by. The default is not to filter by due date.",
        optional: true,    
      }),
      coda.makeParameter({
        type: coda.ParameterType.Date,
        name: "dueMax",
        description: "Upper bound for a task's due date to filter by. The default is not to filter by due date.",
        optional: true,    
      }),
      coda.makeParameter({
        type: coda.ParameterType.Date,
        name: "completedMin",
        description: "Lower bound for a task's completion date to filter by. The default is not to filter by completion date.",
        optional: true,    
      }),
      coda.makeParameter({
        type: coda.ParameterType.Date,
        name: "completedMax",
        description: "Upper bound for a task's completion date to filter by. The default is not to filter by completion date.",
        optional: true,    
      }),
      coda.makeParameter({
        type: coda.ParameterType.Date,
        name: "updatedMin",
        description: "Lower bound for a task's last modification time to filter by. The default is not to filter by last modification time.",
        optional: true,    
      }),
      coda.makeParameter({
        type: coda.ParameterType.Boolean,
        name: "showCompleted",
        description: "Flag indicating whether completed tasks are returned in the result. The default is True. Note that `showHidden` must also be True to show tasks completed in first party clients, such as the web UI and Google's mobile apps.",
        optional: true,
        // suggestedValue: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.Boolean,
        name: "showDeleted",
        description: "Flag indicating whether deleted tasks are returned in the result. The default is False.",
        optional: true,
        // suggestedValue: false,
      }),
      coda.makeParameter({
        type: coda.ParameterType.Boolean,
        name: "showHidden",
        description: "Flag indicating whether hidden tasks are returned in the result. The default is False.",
        optional: true,
        // suggestedValue: false,
      }),
    ],
  
    execute: async function ([taskList = "primary", dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted = true, showDeleted = false, showHidden = false], context) {
      type TaskDTO = Omit<Task, 'due'> & { due: string }; // override Task due field from Date to string type
      // DTO in the sense that it is similar to the rest resource (JSON compatible types only) but includes only those props exposed to the top-level
      return {
        result: (
          await tasks([ taskList, dueMin, dueMax, completedMin, completedMax, updatedMin, showCompleted, showDeleted, showHidden ], context) // the typing forces us to await here :/
          ) as TaskDTO[],
      };
    }
  }
});
