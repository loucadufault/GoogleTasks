function makePropertiesOptional(o: { [keys: string]: {} }, optional=true) {
  return Object.keys(o).reduce(
    (acc, key) => { 
      acc[key] = { ...o[key], optional }; 
      return acc; 
    }, {});
}

function renameProperty(o: { [keys: string]: {} }, oldKey: string, newKey: string) {
  delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey];
}

export {
  makePropertiesOptional,
  renameProperty,
}
