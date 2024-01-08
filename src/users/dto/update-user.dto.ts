import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsOptional } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    type: String,
    description: 'Student profile id of the user',
    required: false
  })
  @IsOptional()
  @IsMongoId()
  studentProfile?: string
}
