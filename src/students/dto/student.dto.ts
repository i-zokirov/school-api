import { Expose, Type } from 'class-transformer'
import { GroupDto } from 'src/groups/dto/group.dto'
import { UserDto } from 'src/users/dto/user.dto'

export class StudentDto {
  @Expose()
  id: string
  @Expose()
  createdAt: string
  @Expose()
  updatedAt: string

  @Expose()
  @Type(() => UserDto)
  user: string

  @Expose()
  @Type(() => GroupDto)
  group: GroupDto
}
