import { UseInterceptors } from '@nestjs/common'
import { ParamValidationInterceptor } from 'src/interceptors/param-validation'

export default function ValidateRoutParams() {
  return UseInterceptors(new ParamValidationInterceptor())
}
