import Syncano from '@syncano/core'
import {MODELS} from './constants'

export default async ctx => {
  const {users, response, logger} = new Syncano(ctx)
  const {error, info, warn} = logger('user-profile:get')

  if (!ctx.meta.user) {
    warn('Unauthorized.')
    return response.json({message: 'Unauthorized.'}, 401)
  }

  try {
    const profile = await users
      .fields(MODELS.profile)
      .findOrFail(ctx.meta.user.id)

    info(`Found user with id ${ctx.meta.user.id}`, profile)
    response.json(profile)
  } catch (err) {
    error(err.message)
    response.json({message: err.message}, 500)
  }
}
