type Link = {
  type: string,
  description: string,
  link: string
}

export type Task = {
  title?: string,
  notes?: string,
  status?: string,
  due?: Date,
  deleted?: boolean,
  links?: Link[],
}
