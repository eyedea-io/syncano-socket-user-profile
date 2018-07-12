/* global describe it expect */
import sinon from 'sinon'
import syncanoMock from '@syncano/core'
import {run} from '@syncano/test'

describe('my', () => {
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
    const result = await run('my', {args})

    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('can find profile', async () => {
    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            find: sinon.stub().resolves(fakeProfile)
          }
        }
      }
    })

    const result = await run('my', {meta})

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toEqual(fakeProfile)
  })
})
