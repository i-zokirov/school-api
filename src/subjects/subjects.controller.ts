import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles'
import ValidateRoutParams from 'src/decorators/validate-params'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { AuthorizationGuard } from 'src/guards/authorization.guard'
import { UserRole } from 'src/types/enums'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { SubjectsService } from './subjects.service'

@Controller('subjects')
@ValidateRoutParams()
@ApiTags('Subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(UserRole.Director)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiBody({ type: CreateSubjectDto })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  findAll() {
    return this.subjectsService.findAll()
  }

  @Get(':subject_id')
  findOne(@Param('subject_id') subject_id: string) {
    return this.subjectsService.findOne({ where: { id: subject_id } })
  }

  @Patch(':subject_id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(UserRole.Director)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update a subject' })
  @ApiBody({ type: UpdateSubjectDto })
  update(
    @Param('subject_id') subject_id: string,
    @Body() updateSubjectDto: UpdateSubjectDto
  ) {
    return this.subjectsService.updateOneById(subject_id, updateSubjectDto)
  }

  @Delete(':subject_id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(UserRole.Director)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete a subject' })
  remove(@Param('subject_id') subject_id: string) {
    return this.subjectsService.removeOneById(subject_id)
  }
}
