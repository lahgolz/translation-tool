import { Logger } from '@adonisjs/core/logger'
import { HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'

/**
 * The container bindings middleware binds classes to their request
 * specific value using the container resolver.
 *
 * - We bind "HttpContext" class to the "context" object
 * - And bind "Logger" class to the "context.logger" object
 */
export default class ContainerBindingsMiddleware {
  handle(context: HttpContext, next: NextFn) {
    const { containerResolver, logger } = context

    containerResolver.bindValue(HttpContext, context)
    containerResolver.bindValue(Logger, logger)

    return next()
  }
}
