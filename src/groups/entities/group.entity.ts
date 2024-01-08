import { Student } from 'src/students/entities/student.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @OneToMany(() => Student, (student) => student.group, { onDelete: 'CASCADE' })
  students: Student[]

  @ManyToMany(() => User, (user) => user.groups, { onDelete: 'CASCADE' })
  @JoinTable()
  teachers: User[]

  @ManyToMany(() => Subject, (subject) => subject.groups, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  subjects: Subject[]

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  createdBy: User

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
