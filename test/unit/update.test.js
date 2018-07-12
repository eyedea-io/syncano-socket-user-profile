/* global describe it expect */
import sinon from 'sinon'
import syncanoMock from '@syncano/core'
import {run} from '@syncano/test'

describe('update', () => {
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
    const result = await run('update')

    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('can update profile', async () => {
    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            update: sinon.stub().resolves(fakeProfile)
          }
        }
      }
    })

    const result = await run('update', {meta})

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toEqual(fakeProfile)
  })

  it('can throw error', async () => {
    const args = {}
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

    const result = await run('update', {args, meta})

    expect(result).toHaveProperty('code', 500)
    expect(result.data).toEqual({message: fakeResponse.message})
  })
})
