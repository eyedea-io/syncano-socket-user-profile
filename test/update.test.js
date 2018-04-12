import sinon from 'sinon'
import {assert} from 'chai'
import {describe, it} from 'mocha'
import {run} from '@syncano/test'
import {buildStubObj, createSyncanoCoreStub} from './utils'

describe('update', () => {
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
    const result = await run('update', {meta: {}}, {})

    assert.propertyVal(result, 'code', 401)
    assert.deepPropertyVal(result.data, 'message', 'Unauthorized.')
  })

  it('can update profile', async () => {
    const SyncanoCoreStub = createSyncanoCoreStub(
      buildStubObj(
        ['users', 'fields()', 'update'],
        sinon.stub().resolves(fakeProfile)
      )
    )
    const mocks = {'@syncano/core': SyncanoCoreStub}
    const result = await run('update', {meta}, {mocks})

    assert.propertyVal(result, 'code', 200)
    assert.deepPropertyVal(result, 'data', fakeProfile)
  })

  it('can throw error', async () => {
    const args = {}
    const fakeResponse = new Error('An error occured.')
    const SyncanoCoreStub = createSyncanoCoreStub(
      buildStubObj(
        ['users', 'fields()', 'update'],
        sinon.stub().rejects(fakeResponse)
      )
    )
    const mocks = {'@syncano/core': SyncanoCoreStub}
    const result = await run('update', {args, meta}, {mocks})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
})
