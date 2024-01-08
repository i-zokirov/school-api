import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import Serialize from 'src/decorators/serialize'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'
import { AuthService } from './auth.service'
import { AuthSuccessDto } from './dto/auth-success.dto'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({
    type: CreateUserDto
  })
  @Serialize(AuthSuccessDto)
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const registerData = await this.authService.registerUser(createUserDto)
      return registerData
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          'User with this email address already exists'
        )
      }
      throw new BadRequestException(error.message)
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  @ApiBody({
    type: LoginUserDto
  })
  @Serialize(AuthSuccessDto)
  async login(@Body() loginUserDto: LoginUserDto) {
    const authenticatedUser = await this.authService.authenticateUser(
      loginUserDto.email,
      loginUserDto.password
    )
    if (!authenticatedUser) {
      throw new BadRequestException('Invalid credentials')
    }
    return {
      ...authenticatedUser,
      access_token: this.authService.generateJWT(authenticatedUser as User)
    }
  }
}
