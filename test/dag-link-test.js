/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const CID = require('cids')
const DAGLink = require('../src').DAGLink

module.exports = (repo) => {
  describe('DAGLink', () => {
    describe('create with multihash as b58 encoded string', () => {
      it('string', () => {
        const link = new DAGLink('hello', 3, 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U')

        expect(link.Hash.buffer.toString('hex'))
          .to.equal('12208ab7a6c5e74737878ac73863cb76739d15d4666de44e5756bf55a2f9e9ab5f43')
      })

      it('empty string', () => {
        const link = new DAGLink('', 4, 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U')
        expect(link.Name).to.be.eql('')
      })

      it('create with multihash as a multihash Buffer', () => {
        const link = new DAGLink('hello', 3, Buffer.from('12208ab7a6c5e74737878ac73863cb76739d15d4666de44e5756bf55a2f9e9ab5f43', 'hex'))

        expect(new CID(link.Hash).toBaseEncodedString())
          .to.equal('QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U')
      })

      it('fail to create without multihash', () => {
        expect(() => {
          const link = new DAGLink('hello', 3)
          expect(link).to.not.exist()
        }).to.throw()
      })
    })

    it('toJSON', () => {
      const link = new DAGLink('hello', 3, 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U')

      expect(link.toJSON()).to.eql({
        name: 'hello',
        size: 3,
        cid: 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U'
      })
    })

    it('toString', () => {
      const link = new DAGLink('hello', 3, 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U')

      expect(link.toString()).to.equal('DAGLink <QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U - name: "hello", size: 3>')
    })

    it('exposes a CID', () => {
      const cid = 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U'
      const link = new DAGLink('hello', 3, cid)
      expect(link.Hash.toBaseEncodedString()).to.equal(cid)
    })

    it('has an immutable CID', () => {
      const link = new DAGLink('hello', 3, 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39U')
      expect(() => { link.Hash = 'foo' }).to.throw(/property/)
    })
  })
}
