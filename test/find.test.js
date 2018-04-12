import sinon from 'sinon'
import {assert} from 'chai'
import {describe, it} from 'mocha'
import {run} from '@syncano/test'
import {buildStubObj, createSyncanoCoreStub} from './utils'

describe('find', () => {
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
    const result = await run('find', {args, meta: {}}, {})

    assert.propertyVal(result, 'code', 401)
    assert.deepPropertyVal(result.data, 'message', 'Unauthorized.')
  })

  it('can find profile', async () => {
    const args = { id: 1 }
    const SyncanoCoreStub = createSyncanoCoreStub(
      buildStubObj(
        ['users', 'fields()', 'findOrFail'],
        sinon.stub().resolves(fakeProfile)
      )
    )
    const mocks = {'@syncano/core': SyncanoCoreStub}
    const result = await run('find', {args, meta}, {mocks})

    assert.propertyVal(result, 'code', 200)
    assert.deepPropertyVal(result, 'data', fakeProfile)
  })

  it('can throw not found', async () => {
    const args = { id: -1 }
    const fakeResponse = new Error('Profile was not found.')
    const SyncanoCoreStub = createSyncanoCoreStub(
      buildStubObj(
        ['users', 'fields()', 'findOrFail'],
        sinon.stub().rejects(fakeResponse)
      )
    )
    const mocks = {'@syncano/core': SyncanoCoreStub}
    const result = await run('find', {args, meta}, {mocks})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
})
