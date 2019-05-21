'use strict'

const sortLinks = require('./sortLinks')
const toDAGLink = require('./toDAGLink')
const DAGLink = require('../dag-link')
const DAGNode = require('./index')
const addNamedLink = require('./addNamedLink')

const asDAGLink = async (link) => {
  if (DAGLink.isDAGLink(link)) {
    // It's a DAGLink instance
    // no need to do anything
    return link
  }

  if (DAGNode.isDAGNode(link)) {
    // It's a DAGNode instance
    // convert to link
    return toDAGLink(link, {})
  }

  // It's a Object with name, multihash/hash/cid and size
  return new DAGLink(link.Name || link.name, link.Tsize || link.size, link.Hash || link.multihash || link.hash || link.cid)
}

const addLink = async (node, link) => {
  const dagLink = await asDAGLink(link)
  node._links.push(dagLink)
  addNamedLink(node, dagLink.Name, node._links.length - 1)
  node._links = sortLinks(node._links)
}

module.exports = addLink
