import * as coda from "@codahq/packs-sdk";


// re-using the same schema in composing other schemas seems to introduce bugs, better to hardcode for
// const dateSchema = coda.makeSchema({ type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime });

// const urlSchema = coda.makeSchema({ type: coda.ValueType.String, codaType: coda.ValueHintType.Url });

const linkSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    type: { type: coda.ValueType.String },
    description: { type: coda.ValueType.String },
    link: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url }
  }
});

const taskSchemaDefinition: coda.ObjectSchemaDefinition<string, string> = {
  type: coda.ValueType.Object,
  properties: {
    taskId: { type: coda.ValueType.String, fromKey: "id" }, /** @see https://coda.io/packs/build/latest/guides/advanced/schemas/#row-identifier */
    updated: { type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime },
    // selfLink: UrlSchema,
    completed: { type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime },
    hidden: { type: coda.ValueType.Boolean },
    // stage 3
    // parent: { type: coda.ValueType.String, optional: true },
    // position: { type: coda.ValueType.String },

    title: { type: coda.ValueType.String },
    notes: { type: coda.ValueType.String },
    status: { type: coda.ValueType.String },
    due: { type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime },
    deleted: { type: coda.ValueType.Boolean },
    links: { type: coda.ValueType.Array, items: linkSchema }
  },
  displayProperty: "title" // todo, upgrade sdk and rename to displayProperty
};

export const taskSchema = coda.makeObjectSchema(taskSchemaDefinition);

export const syncTableTaskSchema = coda.makeObjectSchema({
  ...taskSchemaDefinition, 
  idProperty: "taskId", 
  featuredProperties: ["notes", "status", "due"] });

export const tasklistSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    tasklistId: { type: coda.ValueType.String, fromKey: "id" },
    title: { type: coda.ValueType.String },
    updated: { type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime },
    // selfLink: UrlSchema,
  },
  displayProperty: "title"
});
