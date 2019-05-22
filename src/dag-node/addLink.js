'use strict'

const sortLinks = require('./sortLinks')
const DAGLink = require('../dag-link')
const addNamedLink = require('./addNamedLink')

const asDAGLink = (link) => {
  if (DAGLink.isDAGLink(link)) {
    // It's a DAGLink instance
    // no need to do anything
    return link
  }

  // DAGNode.isNode() would be more appropriate here, but it can't be used
  // as it would lead to circular dependencies as `addLink` is called from
  // within the DAGNode object.
  if (!('cid' in link ||
        'hash' in link ||
        'Hash' in link ||
        'multihash' in link)) {
    throw new Error('Link must be a DAGLink or DAGLink-like. DAGNodes can be converted into a DAGLink via `node.toDAGLink()`.')
  }

  // It's a Object with name, multihash/hash/cid and size
  return new DAGLink(link.Name || link.name, link.Tsize || link.size, link.Hash || link.multihash || link.hash || link.cid)
}

const addLink = (node, link) => {
  const dagLink = asDAGLink(link)
  node._links.push(dagLink)
  addNamedLink(node, dagLink.Name, node._links.length - 1)
  node._links = sortLinks(node._links)
}

module.exports = addLink
