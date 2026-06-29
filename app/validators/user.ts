import vine from '@vinejs/vine'

export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: vine.string().email().maxLength(254).unique({ table: 'users', column: 'email' }),
  password: vine.string().minLength(8).maxLength(254).confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
