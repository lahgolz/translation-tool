/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  passwordResets: {
    create: typeof routes['password_resets.create']
    store: typeof routes['password_resets.store']
    edit: typeof routes['password_resets.edit']
    update: typeof routes['password_resets.update']
  }
}
