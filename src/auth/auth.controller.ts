import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({
    type: CreateUserDto
  })
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
}
