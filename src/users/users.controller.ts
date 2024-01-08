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
  Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user'
import { Roles } from 'src/decorators/roles'
import Serialize from 'src/decorators/serialize'
import ValidateRoutParams from 'src/decorators/validate-params'
import { AuthenticationGuard } from 'src/guards/authentication.guard'
import { AuthorizationGuard } from 'src/guards/authorization.guard'
import { StudentsService } from 'src/students/students.service'
import { UserRole } from 'src/types/enums'
import { FindManyOptions } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
@Serialize(UserDto)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiBearerAuth('jwt')
@ValidateRoutParams()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @Roles(UserRole.Director)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto)
      if (!user) throw new BadRequestException()
      if (user.role === UserRole.Student) {
        const studentProfile = await this.studentsService.create({
          user_id: user.id
        })

        if (!studentProfile) throw new BadRequestException()
        const updated = await this.usersService.updateUser(user, {
          studentProfile: studentProfile.id
        })

        return { ...updated, studentProfile }
      } else {
        return user
      }
    } catch (error) {
      console.error(error.message)
      if (error.code === '23505')
        throw new BadRequestException('Email already exists')
      throw new BadRequestException(error.message)
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  async findAll(@Query() role?: string) {
    const options: FindManyOptions = {
      relations: ['studentProfile']
    }
    if (role && Object.values(UserRole).includes(role as any)) {
      options.where = { role }
    }
    const users = await this.usersService.findAll(options)
    return users
  }

  @Get(':user_id')
  @ApiOperation({ summary: 'Find a user by id' })
  async findOne() {
    const users = await this.usersService.findAll({
      relations: ['studentProfile']
    })
    return users
  }

  @Patch(':user_id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: UpdateUserDto })
  async updateOne(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User
  ) {
    if (authUser.role !== UserRole.Director && authUser.id !== user_id)
      throw new UnauthorizedException(
        'You are not authorized to update this resource'
      )

    if (authUser.role !== UserRole.Director && updateUserDto.role)
      throw new UnauthorizedException(
        'You are not authorized to update this resource'
      )

    if (updateUserDto.role) {
      const user = await this.usersService.findOne({
        where: { id: user_id },
        relations: ['studentProfile']
      })

      if (!user)
        throw new NotFoundException(`User with id ${user_id} not found`)

      if (user.role !== updateUserDto.role) {
        if (user.role === UserRole.Student && user.studentProfile) {
          await this.studentsService.remove(user.studentProfile.id)
        }
      }

      if (updateUserDto.role === UserRole.Student && !user.studentProfile) {
        const studentProfile = await this.studentsService.create({
          user_id: user.id
        })

        if (!studentProfile) throw new BadRequestException()
        updateUserDto.studentProfile = studentProfile.id
      }

      return this.usersService.updateUser(user, updateUserDto)
    }

    return this.usersService.updateById(user_id, updateUserDto)
  }

  @Delete(':user_id')
  @ApiOperation({ summary: 'Delete a user' })
  @Roles(UserRole.Director)
  async remove(@Param('user_id') user_id: string) {
    const user = await this.usersService.findOne({
      where: { id: user_id },
      relations: ['studentProfile']
    })

    if (!user) throw new NotFoundException(`User with id ${user_id} not found`)

    if (user.role === UserRole.Student && user.studentProfile) {
      await this.studentsService.remove(user.studentProfile.id)
    }

    return this.usersService.removeUser(user)
  }
}
