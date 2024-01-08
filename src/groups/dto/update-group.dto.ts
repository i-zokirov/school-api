import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateGroupDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'Group name',
    example: 'Group 1'
  })
  @IsOptional()
  @IsString()
  name: string
}
