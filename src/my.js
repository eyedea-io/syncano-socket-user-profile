import Syncano from '@syncano/core'
import {MODELS} from './constants'

export default async ctx => {
  const {users, response, logger} = new Syncano(ctx)
  const {info, warn} = logger('user-profile:my')

  if (!ctx.meta.user) {
    warn('Unauthorized.')
    return response.json({message: 'Unauthorized.'}, 401)
  }

  const profile = await users
    .fields(MODELS.invitation)
    .find(ctx.meta.user.id)

  info(`Found user with id ${ctx.meta.user.id}`, profile)
  response.json(profile)
}
