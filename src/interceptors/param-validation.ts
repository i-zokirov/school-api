import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { isUUID } from 'class-validator'
import { Observable } from 'rxjs'

@Injectable()
export class ParamValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const params = request.params

    for (let paramName in params) {
      if (params.hasOwnProperty(paramName) && !isUUID(params[paramName])) {
        throw new BadRequestException(
          `The parameter ${paramName} must be a valid UUID`
        )
      }
    }

    return next.handle()
  }
}
