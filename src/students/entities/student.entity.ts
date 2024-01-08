import { Group } from 'src/groups/entities/group.entity'
import { User } from 'src/users/entities/user.entity'
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, (student) => student.studentProfile, {
    onDelete: 'CASCADE'
  })
  user: User

  @ManyToOne(() => Group, (group) => group.students, {
    onDelete: 'SET NULL',
    nullable: true
  })
  group: Group

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
