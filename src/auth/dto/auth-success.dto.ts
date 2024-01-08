import { Expose } from 'class-transformer'
import { UserDto } from 'src/users/dto/user.dto'

export class AuthSuccessDto extends UserDto {
  @Expose()
  access_token: string
}
