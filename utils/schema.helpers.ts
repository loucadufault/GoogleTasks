function makePropertiesOptional(properties: { [keys: string]: {} }, optional=true) {
  return Object.keys(properties).reduce(
    (acc, key) => { 
      acc[key] = { ...properties[key], optional }; 
      return acc; 
    }, {});
}

export {
  makePropertiesOptional,
}
