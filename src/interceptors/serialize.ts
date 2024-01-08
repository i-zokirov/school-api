import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ClassContructor {
  new (...args: any[]): {}
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassContructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) =>
        plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        })
      )
    )
  }
}
