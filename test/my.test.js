import sinon from 'sinon'
import {assert} from 'chai'
import {describe, it} from 'mocha'
import {run} from '@syncano/test'
import {buildStubObj, createSyncanoCoreStub} from './utils'

describe('my', () => {
  const meta = {
    user: {
      id: 5,
      username: 'fakeName'
    }
  }
  const fakeProfile = {
    givenName: "Joe",
    familyName: "Doe",
    image: "http://via.placeholder.com/256x256"
  }

  it('allows only authorized requests', async () => {
    const args = { id: 1 }
    const result = await run('my', {args, meta: {}}, {})

    assert.propertyVal(result, 'code', 401)
    assert.deepPropertyVal(result.data, 'message', 'Unauthorized.')
  })

  it('can find profile', async () => {
    const SyncanoCoreStub = createSyncanoCoreStub(
      buildStubObj(
        ['users', 'fields()', 'find'],
        sinon.stub().resolves(fakeProfile)
      )
    )
    const mocks = {'@syncano/core': SyncanoCoreStub}
    const result = await run('my', {meta}, {mocks})

    assert.propertyVal(result, 'code', 200)
    assert.deepPropertyVal(result, 'data', fakeProfile)
  })
})
