import * as coda from "@codahq/packs-sdk";

import { makePropertiesOptional } from "./utils/schema.helpers";

const dateSchema = coda.makeSchema({ type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime });

const UrlSchema = coda.makeSchema({ type: coda.ValueType.String, codaType: coda.ValueHintType.Url });

const linkSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    type: { type: coda.ValueType.String },
    description: { type: coda.ValueType.String },
    link: UrlSchema
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


export const taskSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    id: { type: coda.ValueType.String },
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
  primary: "title"
});

export const tasklistSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    id: { type: coda.ValueType.String },
    title: { type: coda.ValueType.String },
    updated: dateSchema,
    // selfLink: UrlSchema,
  },
  primary: "title"
});
