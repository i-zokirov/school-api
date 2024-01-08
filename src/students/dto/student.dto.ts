import { Expose, Type } from 'class-transformer'
import { UserDto } from 'src/users/dto/user.dto'

export class StudentDto {
  @Expose()
  id: string
  @Expose()
  @Type(() => UserDto)
  user: string
  @Expose()
  group: string
  @Expose()
  createdAt: string
  @Expose()
  updatedAt: string
}
