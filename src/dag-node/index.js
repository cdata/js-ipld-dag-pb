'use strict'

const withIs = require('class-is')
const addNamedLink = require('./addNamedLink')
const sortLinks = require('./sortLinks')
const visibility = require('../visibility')
const { serializeDAGNode } = require('../serialize.js')
const DAGLink = require('../dag-link')
const toDAGLink = require('./toDAGLink')

class DAGNode {
  constructor (data, links = [], serializedSize = 0) {
    if (!data) {
      data = Buffer.alloc(0)
    }
    if (typeof data === 'string') {
      data = Buffer.from(data)
    }
    if (!Buffer.isBuffer(data)) {
      throw new Error('Passed \'data\' is not a buffer or a string!')
    }

    links = links.map((link) => {
      return DAGLink.isDAGLink(link)
        ? link
        : DAGLink.util.createDagLinkFromB58EncodedHash(link)
    })
    links = sortLinks(links)

    if (serializedSize === 0) {
      serializedSize = serializeDAGNode({
        Data: data,
        Links: links
      }).length
    }

    this._data = data
    this._links = links
    this._serializedSize = serializedSize
    this._namedLinks = {}

    // Make sure we have a nice public API that can be used by an IPLD resolver
    visibility.hidePrivateFields(this)
    visibility.addEnumerableGetters(this, ['Data', 'Links'])

    // Add getters for existing links by the name of the link
    // This is how paths are traversed in IPFS. Links with names won't
    // override existing fields like `data` or `links`.
    links.forEach((link, position) => {
      addNamedLink(this, link.Name, position)
    })
  }

  toJSON () {
    if (!this._json) {
      this._json = Object.freeze({
        data: this.Data,
        links: this._links.map((l) => l.toJSON()),
        size: this.size
      })
    }

    return Object.assign({}, this._json)
  }

  toString () {
    return `DAGNode <data: "${this.Data.toString('base64')}", links: ${this.Links.length}, size: ${this.size}>`
  }

  async toDAGLink (options) {
    return toDAGLink(this, options)
  }

  get size () {
    if (this._size === undefined) {
      this._size = this._links.reduce((sum, l) => sum + l.Tsize, this._serializedSize)
    }

    return this._size
  }

  set size (size) {
    throw new Error("Can't set property: 'size' is immutable")
  }

  // Getters for backwards compatible path resolving
  get Data () {
    return this._data
  }
  set Data (_) {
    throw new Error("Can't set property: 'Data' is immutable")
  }
  get Links () {
    return this._links.map((link) => {
      return {
        Name: link.Name,
        Tsize: link.Tsize,
        Hash: link.Hash
      }
    })
  }
  set Links (_) {
    throw new Error("Can't set property: 'Links' is immutable")
  }
}

exports = module.exports = withIs(DAGNode, { className: 'DAGNode', symbolName: '@ipld/js-ipld-dag-pb/dagnode' })
exports.addLink = require('./addLink')
exports.rmLink = require('./rmLink')
