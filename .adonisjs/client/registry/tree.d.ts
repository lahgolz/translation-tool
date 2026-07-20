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
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    create: typeof routes['projects.create']
    show: typeof routes['projects.show']
    update: typeof routes['projects.update']
    settings: typeof routes['projects.settings']
    picture: {
      store: typeof routes['projects.picture.store']
      destroy: typeof routes['projects.picture.destroy']
    }
    languages: {
      store: typeof routes['projects.languages.store']
      destroy: typeof routes['projects.languages.destroy']
      default: typeof routes['projects.languages.default']
    }
  }
}
