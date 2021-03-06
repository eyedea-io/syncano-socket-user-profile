/* global describe it expect */
import sinon from 'sinon'
import syncanoMock from '@syncano/core'
import {run} from '@syncano/test'

describe('find', () => {
  const meta = {
    user: {
      id: 5,
      username: 'fakeName'
    }
  }
  const fakeProfile = {
    givenName: 'Joe',
    familyName: 'Doe',
    image: 'http://via.placeholder.com/256x256'
  }

  it('allows only authorized requests', async () => {
    const args = { id: 1 }
    const result = await run('find', {args, meta: {}}, {})

    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('can find profile', async () => {
    const args = { id: 1 }

    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            findOrFail: sinon.stub().resolves(fakeProfile)
          }
        }
      }
    })

    const result = await run('find', {args, meta})

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toEqual(fakeProfile)
  })

  it('can throw not found', async () => {
    const args = { id: -1 }
    const fakeResponse = new Error('Profile was not found.')

    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            findOrFail: sinon.stub().rejects(fakeResponse)
          }
        }
      }
    })

    const result = await run('find', {args, meta})

    expect(result).toHaveProperty('code', 500)
    expect(result.data).toEqual({message: fakeResponse.message})
  })
})
