import { Student } from 'src/students/entities/student.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: String })
  name: string

  @OneToMany(() => Student, (student) => student.group, { onDelete: 'CASCADE' })
  students: Student[]
}
