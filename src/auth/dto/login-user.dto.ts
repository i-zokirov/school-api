import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'Email of the user',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    type: String,
    description: 'Password of the user',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
