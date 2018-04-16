import Syncano from '@syncano/core'
import {MODELS} from './constants'

export default async ctx => {
  const {users, response, logger} = new Syncano(ctx)
  const {error, info, warn} = logger('user-profile:update')
  const {givenName, familyName, image} = ctx.args

  if (!ctx.meta.user) {
    warn('Unauthorized.')
    return response.json({message: 'Unauthorized.'}, 401)
  }

  try {
    const profile = await users
      .fields(MODELS.profile)
      .update(
        ctx.meta.user.id,
        {givenName, familyName, image}
      )

    info('Sucessfuly updated user profile')
    response.json(profile)
  } catch (err) {
    error(err.message)
    response.json({message: err.message}, 500)
  }
}
