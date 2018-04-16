import Syncano from '@syncano/core'
import {MODELS} from './constants'

export default async ctx => {
  const {users, response, logger} = new Syncano(ctx)
  const {info, warn} = logger('api:user/remove-image')

  if (!ctx.meta.user) {
    warn('Unauthorized request.')

    return response.json({message: 'Unauthorized.'}, 401)
  }

  const user = await users
    .fields(MODELS.profile)
    .update(ctx.meta.user.id, {image: null})

  info(`Avatar for user with id ${ctx.meta.user.id} was removed.`)

  response.json(user)
}
