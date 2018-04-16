import Syncano from '@syncano/core'
import FormData from 'form-data'
import {MODELS} from './constants'

export default async ctx => {
  const {users, response, logger} = new Syncano(ctx)
  const {info, error, warn} = logger('api:user/update-image')

  if (!ctx.meta.user) {
    warn('Unauthorized request.')

    return response.json({message: 'Unauthorized.'}, 401)
  }

  try {
    if (!ctx.args.image) { throw new Error('Parameter "image" is required.') }
    if (!ctx.args.filename) { throw new Error('Parameter "filename" is required.') }
    if (!ctx.args.filetype) { throw new Error('Parameter "filetype" is required.') }
  } catch (err) {
    return response.json({message: err.message}, 400)
  }

  try {
    const user = await users
      .fields(MODELS.profile)
      .update(ctx.meta.user.id, getForm(ctx))

    info(`Image for user with id ${ctx.meta.user.id} was updated.`)

    response.json(user)
  } catch (err) {
    error(err.message)
    response.json({message: err.message}, 500)
  }
}

function getForm (ctx) {
  const form = new FormData()

  form.append('image', ctx.args.image, {
    filename: ctx.args.filename,
    filetype: ctx.args.filetype
  })

  return form
}
