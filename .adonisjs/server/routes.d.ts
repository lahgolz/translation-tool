import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'password_resets.create': { paramsTuple?: []; params?: {} }
    'password_resets.store': { paramsTuple?: []; params?: {} }
    'password_resets.edit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'password_resets.update': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.settings': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.picture.store': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.picture.destroy': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.languages.store': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.languages.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'language': ParamValue} }
    'projects.languages.default': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'language': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'password_resets.create': { paramsTuple?: []; params?: {} }
    'password_resets.edit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.settings': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'password_resets.create': { paramsTuple?: []; params?: {} }
    'password_resets.edit': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.settings': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'password_resets.store': { paramsTuple?: []; params?: {} }
    'password_resets.update': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.picture.store': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.languages.store': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  PUT: {
    'projects.update': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.languages.default': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'language': ParamValue} }
  }
  DELETE: {
    'projects.picture.destroy': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'projects.languages.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'language': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}