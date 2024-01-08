import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { Subject } from './entities/subject.entity'
import { SubjectsController } from './subjects.controller'
import { SubjectsService } from './subjects.service'

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), AuthModule, UsersModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService]
})
export class SubjectsModule {}
