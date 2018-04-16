import sinon from 'sinon'
import {assert} from 'chai'
import {describe, it} from 'mocha'
import {run} from '@syncano/test'
import {buildStubObj, createSyncanoCoreStub} from './utils'

describe('update-image', () => {
  const meta = {
    user: {
      id: 5,
      username: 'fakeName'
    }
  }

  it('allows only authorized requests', async () => {
    const result = await run('update-image', {meta: {}}, {})

    assert.propertyVal(result, 'code', 401)
    assert.deepPropertyVal(result.data, 'message', 'Unauthorized.')
  })
  it('requires image in args', async () => {
    const fakeResponse = new Error('Parameter "image" is required.')
    const result = await run('update-image', {meta})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
  it('requires filename in args', async () => {
    const args = {image: 'xxx'}
    const fakeResponse = new Error('Parameter "filename" is required.')
    const result = await run('update-image', {args, meta})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
  it('requires filetype in args', async () => {
    const args = {image: 'xxx', filename: 'image/png'}
    const fakeResponse = new Error('Parameter "filetype" is required.')
    const result = await run('update-image', {args, meta})

    assert.propertyVal(result, 'code', 400)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
  it('can update image', async () => {
    const args = {
      image: 'test',
      filename: 'file_name.jpg',
      filetype: 'image/jpg'
    }
    const mocks = {
      '@syncano/core': createSyncanoCoreStub(buildStubObj(
        ['users', 'fields()', 'update'],
        sinon.stub().resolves(meta.user)
      ))
    }
    const result = await run('update-image', {args, meta}, {mocks})

    assert.propertyVal(result, 'code', 200)
    assert.deepPropertyVal(result, 'data', meta.user)
  })
  it('can throw error', async () => {
    const args = {
      image: 'test',
      filename: 'file_name.jpg',
      filetype: 'image/jpg'
    }
    const fakeResponse = new Error('An error occured.')
    const SyncanoCoreStub = createSyncanoCoreStub(
      buildStubObj(
        ['users', 'fields()', 'update'],
        sinon.stub().rejects(fakeResponse)
      )
    )
    const mocks = {'@syncano/core': SyncanoCoreStub}
    const result = await run('update-image', {args, meta}, {mocks})

    assert.propertyVal(result, 'code', 500)
    assert.deepPropertyVal(result, 'data', {message: fakeResponse.message})
  })
})
