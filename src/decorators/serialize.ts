import { UseInterceptors } from '@nestjs/common'
import {
  ClassContructor,
  SerializeInterceptor
} from 'src/interceptors/serialize'

export default function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}
