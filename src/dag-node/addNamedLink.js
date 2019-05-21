'use strict'

/**
 * Adds a link with its name as property to an object.
 *
 * The link won't be added if its name is empty or matches one of the existing
 * properties.
 *
 * @param {Object} object - The object that contains an array of links
 * @param {string} name - The name of the link to add
 * @param {numner} position - The position within the array of links
 */
const addNamedLink = (object, name, position) => {
  const skipNames = ['', ...Object.keys(this)]
  if (skipNames.includes(name)) {
    return
  }
  object._namedLinks[name] = object._links[position].Hash
}

module.exports = addNamedLink
