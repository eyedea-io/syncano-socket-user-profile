import sinon from 'sinon'
import {assert} from 'chai'
import {describe, it} from 'mocha'
import {run} from '@syncano/test'
import {buildStubObj, createSyncanoCoreStub} from './utils'

describe('remove-image', () => {
  const meta = {
    user: {
      id: 5,
      username: 'fakeName'
    }
  }

  it('allows only authorized requests', async () => {
    const result = await run('remove-image', {meta: {}}, {})

    assert.propertyVal(result, 'code', 401)
    assert.deepPropertyVal(result.data, 'message', 'Unauthorized.')
  })
  it('can remove image', async () => {
    const mocks = {
      '@syncano/core': createSyncanoCoreStub(buildStubObj(
        ['users', 'fields()', 'update'],
        sinon.stub().resolves(meta.user)
      ))
    }
    const result = await run('remove-image', {meta}, {mocks})

    assert.propertyVal(result, 'code', 200)
    assert.deepPropertyVal(result, 'data', meta.user)
  })
})
