/**
 * Somewhat of a rugged check if the given string is a valid resource identifier. The aim here is to rule out if a string is definitely not a resource identifier.
 * @param s the input string to test
 * @returns whether or not the given string could potentially be a valid resource identifier (i.e. not definitely invalid).
 */
function mayBeValidResourceIdentifier(s: string) {
  return /^[0-9A-Za-z]+$/.test(s);
}

export {
  mayBeValidResourceIdentifier,
}