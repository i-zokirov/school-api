import {
  BadRequestException,
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
import { SubjectsService } from 'src/subjects/subjects.service'
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
    private readonly studentsService: StudentsService,
    private readonly subjectsService: SubjectsService
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

    if (createGroupDto.subjects && createGroupDto.subjects.length) {
      const subjects = await this.subjectsService.findAll({
        where: { id: In(createGroupDto.subjects) }
      })
      if (subjects && subjects.length) {
        dto.subjects = subjects
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
      relations: ['teachers', 'students', 'createdBy', 'subjects']
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

  @Patch(':group_id/students/:student_id/remove')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Remove student from a group',
    description: `Permissions: ${UserRole.Director}`
  })
  async removeStudent(
    @Param('group_id') group_id: string,
    @Param('student_id') student_id: string
  ) {
    const group = await this.groupsService.findOne({
      where: { id: group_id },
      relations: ['students']
    })

    if (!group)
      throw new NotFoundException(`Group with id ${group_id} not found`)

    const student = await this.studentsService.findOne({
      where: { id: student_id }
    })

    if (!student)
      throw new NotFoundException(`Student with id ${student_id} not found`)

    if (!group.students.some((s) => s.id === student.id))
      throw new BadRequestException(
        `Student with id ${student_id} not found in group with id ${group_id}`
      )

    group.students = group.students.filter((s) => s.id !== student.id)

    return this.groupsService.save(group)
  }

  @Patch(':group_id/students/:student_id/add')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Add student to a group',
    description: `Permissions: ${UserRole.Director}`
  })
  async addStudent(
    @Param('group_id') group_id: string,
    @Param('student_id') student_id: string
  ) {
    const group = await this.groupsService.findOne({
      where: { id: group_id },
      relations: ['students']
    })

    if (!group)
      throw new NotFoundException(`Group with id ${group_id} not found`)

    const student = await this.studentsService.findOne({
      where: { id: student_id }
    })

    if (!student)
      throw new NotFoundException(`Student with id ${student_id} not found`)

    if (group.students.some((s) => s.id === student.id))
      throw new BadRequestException(
        `Student with id ${student_id} already in group with id ${group_id}`
      )

    group.students.push(student)

    return this.groupsService.save(group)
  }

  @Patch(':group_id/teachers/:teacher_id/remove')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Remove teacher from a group',
    description: `Permissions: ${UserRole.Director}`
  })
  async removeTeacher(
    @Param('group_id') group_id: string,
    @Param('teacher_id') teacher_id: string
  ) {
    const group = await this.groupsService.findOne({
      where: { id: group_id },
      relations: ['teachers']
    })

    if (!group)
      throw new NotFoundException(`Group with id ${group_id} not found`)

    const teacher = await this.usersService.findOne({
      where: { id: teacher_id }
    })

    if (!teacher)
      throw new NotFoundException(`Teacher with id ${teacher_id} not found`)

    if (!group.teachers.some((s) => s.id === teacher.id))
      throw new BadRequestException(
        `Teacher with id ${teacher_id} not found in group with id ${group_id}`
      )

    group.teachers = group.teachers.filter((s) => s.id !== teacher.id)

    return this.groupsService.save(group)
  }

  @Patch(':group_id/teachers/:teacher_id/add')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Add teacher to a group',
    description: `Permissions: ${UserRole.Director}`
  })
  async addTeacher(
    @Param('group_id') group_id: string,
    @Param('teacher_id') teacher_id: string
  ) {
    const group = await this.groupsService.findOne({
      where: { id: group_id },
      relations: ['teachers']
    })

    if (!group)
      throw new NotFoundException(`Group with id ${group_id} not found`)

    const teacher = await this.usersService.findOne({
      where: { id: teacher_id }
    })

    if (!teacher)
      throw new NotFoundException(`Teacher with id ${teacher_id} not found`)

    if (teacher.role !== UserRole.Teacher)
      throw new BadRequestException(
        `User with id ${teacher_id} is not a teacher`
      )

    if (group.teachers.some((s) => s.id === teacher.id))
      throw new BadRequestException(
        `Teacher with id ${teacher_id} already in group with id ${group_id}`
      )

    group.teachers.push(teacher)

    return this.groupsService.save(group)
  }

  @Patch(':group_id/subjects/:subject_id/remove')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Remove subject from a group',
    description: `Permissions: ${UserRole.Director}`
  })
  async removeSubject(
    @Param('group_id') group_id: string,
    @Param('subject_id') subject_id: string
  ) {
    const group = await this.groupsService.findOne({
      where: { id: group_id },
      relations: ['subjects']
    })

    if (!group)
      throw new NotFoundException(`Group with id ${group_id} not found`)

    const subject = await this.subjectsService.findOne({
      where: { id: subject_id }
    })

    if (!subject)
      throw new NotFoundException(`Subject with id ${subject_id} not found`)

    if (!group.subjects.some((s) => s.id === subject.id))
      throw new BadRequestException(
        `Subject with id ${subject_id} not found in group with id ${group_id}`
      )

    group.subjects = group.subjects.filter((s) => s.id !== subject.id)

    return this.groupsService.save(group)
  }

  @Patch(':group_id/subjects/:subject_id/add')
  @Roles(UserRole.Director)
  @ApiOperation({
    summary: 'Add subject to a group',
    description: `Permissions: ${UserRole.Director}`
  })
  async addSubject(
    @Param('group_id') group_id: string,
    @Param('subject_id') subject_id: string
  ) {
    const group = await this.groupsService.findOne({
      where: { id: group_id },
      relations: ['subjects']
    })

    if (!group)
      throw new NotFoundException(`Group with id ${group_id} not found`)

    const subject = await this.subjectsService.findOne({
      where: { id: subject_id }
    })

    if (!subject)
      throw new NotFoundException(`Subject with id ${subject_id} not found`)

    if (group.subjects.some((s) => s.id === subject.id))
      throw new BadRequestException(
        `Subject with id ${subject_id} already in group with id ${group_id}`
      )

    group.subjects.push(subject)

    return this.groupsService.save(group)
  }
}
