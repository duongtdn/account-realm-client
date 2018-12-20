"use strict"

describe('Test util lib', () => {
  it('should succeed', (done) => {
    setTimeout(done, 1000)
  })

  it('should fail', () => {
    setTimeout(() => {
      throw new Error('Failed')
    }, 1000)
  })

})