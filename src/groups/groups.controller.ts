import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user'
import { Roles } from 'src/decorators/roles'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { AuthorizationGuard } from 'src/guards/authorization.guard'
import { StudentsService } from 'src/students/students.service'
import { UserRole } from 'src/types/enums'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { In } from 'typeorm'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { Group } from './entities/group.entity'
import { GroupsService } from './groups.service'

@Controller('groups')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiBearerAuth('jwt')
@ApiTags('Groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService
  ) {}

  @Post()
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Create group',
    description: `Permissions: ${UserRole.Director}`
  })
  @ApiBody({ type: CreateGroupDto })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @AuthUser() authUser: User
  ) {
    const dto: Partial<Group> = { createdBy: authUser }
    dto.name = createGroupDto.name

    if (createGroupDto.students && createGroupDto.students.length) {
      const students = await this.studentsService.findAll({
        where: { id: In(createGroupDto.students) }
      })
      if (students && students.length) {
        dto.students = students
      }
    }

    if (createGroupDto.teachers && createGroupDto.teachers.length) {
      const teachers = await this.usersService.findAll({
        where: { id: In(createGroupDto.teachers) }
      })
      if (teachers && teachers.length) {
        dto.teachers = teachers.filter(
          (teacher) => teacher.role === UserRole.Teacher
        )
      }
    }

    return this.groupsService.create(dto)
  }

  @Get()
  @Roles(UserRole.Director, UserRole.Teacher)
  @ApiOperation({
    summary: 'Get all groups',
    description: `Permissions: ${UserRole.Director} ${UserRole.Teacher}`
  })
  async findAll() {
    return this.groupsService.findAll({
      relations: ['teachers', 'students', 'createdBy']
    })
  }

  @Get(':groupd_id')
  @ApiOperation({
    summary: 'Get group by id',
    description: `Permissions: ${UserRole.Director} ${UserRole.Teacher} ${UserRole.Student}`
  })
  async findOne(
    @Param('groupd_id') groupd_id: string,
    @AuthUser() authUser: User
  ) {
    const group = await this.groupsService.findOne({
      where: { id: groupd_id },
      relations: ['teachers', 'students', 'createdBy']
    })
    if (!group)
      throw new NotFoundException(`Group with id ${groupd_id} not found`)

    if (authUser.role === UserRole.Student) {
      if (group.students.some((s) => s.id === authUser.studentProfile.id)) {
        return group
      } else {
        throw new UnauthorizedException(
          'You are not authorized to access this resource'
        )
      }
    } else {
      return group
    }
  }

  @Patch(':group_id')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Update group by id',
    description: `Permissions: ${UserRole.Director}`
  })
  @ApiBody({ type: UpdateGroupDto })
  update(
    @Param('group_id') group_id: string,
    @Body() updateGroupDto: UpdateGroupDto
  ) {
    return this.groupsService.updateOneById(group_id, updateGroupDto)
  }

  @Delete(':group_id')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Delete group by id',
    description: `Permissions: ${UserRole.Director}`
  })
  remove(@Param('group_id') group_id: string) {
    return this.groupsService.removeOneById(group_id)
  }
}
