import { Student } from 'src/students/entities/student.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: String })
  name: string

  @OneToMany(() => Student, (student) => student.group, { onDelete: 'CASCADE' })
  students: Student[]

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  createdBy: User

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
