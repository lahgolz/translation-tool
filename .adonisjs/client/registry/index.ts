/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'password_resets.create': {
    methods: ["GET","HEAD"],
    pattern: '/forgot-password',
    tokens: [{"old":"/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['password_resets.create']['types'],
  },
  'password_resets.store': {
    methods: ["POST"],
    pattern: '/forgot-password',
    tokens: [{"old":"/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['password_resets.store']['types'],
  },
  'password_resets.edit': {
    methods: ["GET","HEAD"],
    pattern: '/reset-password/:token',
    tokens: [{"old":"/reset-password/:token","type":0,"val":"reset-password","end":""},{"old":"/reset-password/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['password_resets.edit']['types'],
  },
  'password_resets.update': {
    methods: ["POST"],
    pattern: '/reset-password',
    tokens: [{"old":"/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['password_resets.update']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.create': {
    methods: ["GET","HEAD"],
    pattern: '/projects/create',
    tokens: [{"old":"/projects/create","type":0,"val":"projects","end":""},{"old":"/projects/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['projects.create']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:slug',
    tokens: [{"old":"/projects/:slug","type":0,"val":"projects","end":""},{"old":"/projects/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.update': {
    methods: ["PUT"],
    pattern: '/projects/:slug',
    tokens: [{"old":"/projects/:slug","type":0,"val":"projects","end":""},{"old":"/projects/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.settings': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:slug/settings',
    tokens: [{"old":"/projects/:slug/settings","type":0,"val":"projects","end":""},{"old":"/projects/:slug/settings","type":1,"val":"slug","end":""},{"old":"/projects/:slug/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['projects.settings']['types'],
  },
  'projects.picture.store': {
    methods: ["POST"],
    pattern: '/projects/:slug/picture',
    tokens: [{"old":"/projects/:slug/picture","type":0,"val":"projects","end":""},{"old":"/projects/:slug/picture","type":1,"val":"slug","end":""},{"old":"/projects/:slug/picture","type":0,"val":"picture","end":""}],
    types: placeholder as Registry['projects.picture.store']['types'],
  },
  'projects.picture.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:slug/picture',
    tokens: [{"old":"/projects/:slug/picture","type":0,"val":"projects","end":""},{"old":"/projects/:slug/picture","type":1,"val":"slug","end":""},{"old":"/projects/:slug/picture","type":0,"val":"picture","end":""}],
    types: placeholder as Registry['projects.picture.destroy']['types'],
  },
  'projects.languages.store': {
    methods: ["POST"],
    pattern: '/projects/:slug/languages',
    tokens: [{"old":"/projects/:slug/languages","type":0,"val":"projects","end":""},{"old":"/projects/:slug/languages","type":1,"val":"slug","end":""},{"old":"/projects/:slug/languages","type":0,"val":"languages","end":""}],
    types: placeholder as Registry['projects.languages.store']['types'],
  },
  'projects.languages.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:slug/languages/:language',
    tokens: [{"old":"/projects/:slug/languages/:language","type":0,"val":"projects","end":""},{"old":"/projects/:slug/languages/:language","type":1,"val":"slug","end":""},{"old":"/projects/:slug/languages/:language","type":0,"val":"languages","end":""},{"old":"/projects/:slug/languages/:language","type":1,"val":"language","end":""}],
    types: placeholder as Registry['projects.languages.destroy']['types'],
  },
  'projects.languages.default': {
    methods: ["PUT"],
    pattern: '/projects/:slug/languages/:language/default',
    tokens: [{"old":"/projects/:slug/languages/:language/default","type":0,"val":"projects","end":""},{"old":"/projects/:slug/languages/:language/default","type":1,"val":"slug","end":""},{"old":"/projects/:slug/languages/:language/default","type":0,"val":"languages","end":""},{"old":"/projects/:slug/languages/:language/default","type":1,"val":"language","end":""},{"old":"/projects/:slug/languages/:language/default","type":0,"val":"default","end":""}],
    types: placeholder as Registry['projects.languages.default']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
