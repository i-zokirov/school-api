import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  generateJWT(user: User) {
    const payload = {
      email: user.email,
      sub: user.id
    }
    return this.jwtService.sign(payload)
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto)
    const { password, ...rest } = user
    return { ...rest, access_token: this.generateJWT(user) }
  }
}
