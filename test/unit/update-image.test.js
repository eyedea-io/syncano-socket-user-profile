/* global describe it expect jest */
import sinon from 'sinon'
import syncanoMock from '@syncano/core'
import {run} from '@syncano/test'

describe('update-image', () => {
  const meta = {
    user: {
      id: 5,
      username: 'fakeName'
    }
  }

  it('allows only authorized requests', async () => {
    const result = await run('update-image')

    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('requires image in args', async () => {
    const fakeResponse = new Error('Parameter "image" is required.')
    const result = await run('update-image', {meta})

    expect(result).toHaveProperty('code', 400)
    expect(result.data.message).toEqual(fakeResponse.message)
  })

  it('requires filename in args', async () => {
    const args = {image: 'xxx'}
    const fakeResponse = new Error('Parameter "filename" is required.')
    const result = await run('update-image', {args, meta})

    expect(result).toHaveProperty('code', 400)
    expect(result.data.message).toEqual(fakeResponse.message)
  })

  it('requires filetype in args', async () => {
    const args = {image: 'xxx', filename: 'image/png'}
    const fakeResponse = new Error('Parameter "filetype" is required.')
    const result = await run('update-image', {args, meta})

    expect(result).toHaveProperty('code', 400)
    expect(result.data.message).toEqual(fakeResponse.message)
  })

  it('can update image', async () => {
    const args = {
      image: 'test',
      filename: 'file_name.jpg',
      filetype: 'image/jpg'
    }

    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            update: sinon.stub().resolves(meta.user)
          }
        }
      }
    })
    const result = await run('update-image', {args, meta})

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toEqual(meta.user)
  })

  it('can throw error', async () => {
    const args = {
      image: 'test',
      filename: 'file_name.jpg',
      filetype: 'image/jpg'
    }
    const fakeResponse = new Error('An error occured.')

    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            update: sinon.stub().rejects(fakeResponse)
          }
        }
      }
    })

    const result = await run('update-image', {args, meta})

    expect(result).toHaveProperty('code', 500)
    expect(result.data.message).toEqual(fakeResponse.message)
  })
})
