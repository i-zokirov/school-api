import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { Student } from './entities/student.entity'
import { StudentsController } from './students.controller'
import { StudentsService } from './students.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService]
})
export class StudentsModule {}
