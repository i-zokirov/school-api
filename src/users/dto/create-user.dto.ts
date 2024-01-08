import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { UserRole } from 'src/types/enums'

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'First name of the user',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  firstName: string

  @ApiProperty({
    type: String,
    description: 'Last name of the user',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  lastName: string

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

  @ApiPropertyOptional({
    type: String,
    description: 'Role of the user',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsEnum([...Object.values(UserRole)])
  role: string
}
