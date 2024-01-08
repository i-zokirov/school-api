import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { StudentsService } from 'src/students/students.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(UsersService)
    private readonly studentsService: StudentsService,
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
    const response: any = { ...rest, access_token: this.generateJWT(user) }
    return response
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } })
    if (!user) {
      return null
    }
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return new BadRequestException('Invalid credentials')
    }
    const { password: _, ...rest } = user
    return rest
  }
}
