/* global describe it expect */
import sinon from 'sinon'
import syncanoMock from '@syncano/core'
import {run} from '@syncano/test'

describe('remove-image', () => {
  const meta = {
    user: {
      id: 5,
      username: 'fakeName'
    }
  }

  it('allows only authorized requests', async () => {
    const result = await run('remove-image')

    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('can remove image', async () => {
    syncanoMock.__setMocks({
      users: {
        fields: () => {
          return {
            update: sinon.stub().resolves(meta.user)
          }
        }
      }
    })

    const result = await run('remove-image', {meta})

    expect(result).toHaveProperty('code', 200)
    expect(result.data).toEqual(meta.user)  })
})
