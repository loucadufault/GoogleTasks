import * as coda from "@codahq/packs-sdk";

import { makePropertiesOptional } from "./utils/schema.helpers";


const dateSchema = coda.makeSchema({ type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime });

const urlSchema = coda.makeSchema({ type: coda.ValueType.String, codaType: coda.ValueHintType.Url });

const linkSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    type: { type: coda.ValueType.String },
    description: { type: coda.ValueType.String },
    link: urlSchema
  }
});

// const readOnlyTaskProperties = {
//   id: coda.makeSchema({ type: coda.ValueType.String }),
//   updated: dateSchema,
//   selfLink: UrlSchema,
//   completed: dateSchema,
//   hidden: coda.makeSchema({ type: coda.ValueType.Boolean }),
//   // stage 3
//   // parent: { type: coda.ValueType.String, optional: true },
//   // position: { type: coda.ValueType.String },
// };

// const writableTaskProperties = {
//   title: coda.makeSchema({ type: coda.ValueType.String }),
//   notes: coda.makeSchema({ type: coda.ValueType.String }),
//   status: coda.makeSchema({ type: coda.ValueType.String }),
//   due: dateSchema,
//   deleted: coda.makeSchema({ type: coda.ValueType.Boolean }),
//   links: coda.makeSchema({ type: coda.ValueType.Array, items: linkSchema })
// }

// export const writableTaskSchema = coda.makeObjectSchema({
//   type: coda.ValueType.Object,
//   properties: {
//     ...(makePropertiesOptional(writableTaskProperties))
//   },
// });

// export const taskSchema = coda.makeObjectSchema({
//   type: coda.ValueType.Object,
//   properties: {
//     ...readOnlyTaskProperties,
//     ...writableTaskProperties
//   },
// });

const taskSchemaDefinition: coda.ObjectSchemaDefinition<string, string> = {
  type: coda.ValueType.Object,
  properties: {
    taskId: { type: coda.ValueType.String, fromKey: "id" }, /** @see https://coda.io/packs/build/latest/guides/advanced/schemas/#row-identifier */
    updated: dateSchema,
    // selfLink: UrlSchema,
    completed: dateSchema,
    hidden: { type: coda.ValueType.Boolean },
    // stage 3
    // parent: { type: coda.ValueType.String, optional: true },
    // position: { type: coda.ValueType.String },

    title: { type: coda.ValueType.String },
    notes: { type: coda.ValueType.String },
    status: { type: coda.ValueType.String },
    due: dateSchema,
    deleted: { type: coda.ValueType.Boolean },
    links: { type: coda.ValueType.Array, items: linkSchema }
  },
  primary: "title" // todo, upgrade sdk and rename to displayProperty
};

export const taskSchema = coda.makeObjectSchema(taskSchemaDefinition);

export const syncTableTaskSchema = coda.makeObjectSchema({
  ...taskSchemaDefinition, 
  idProperty: "taskId", 
  id: "taskId", 
  featuredProperties: ["notes", "status", "due"] });

export const tasklistSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    tasklistId: { type: coda.ValueType.String, fromKey: "id" },
    title: { type: coda.ValueType.String },
    updated: dateSchema,
    // selfLink: UrlSchema,
  },
  primary: "title"
});
