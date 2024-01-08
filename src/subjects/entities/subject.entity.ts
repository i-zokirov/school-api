import { Group } from 'src/groups/entities/group.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: String })
  name: string

  @Column({ type: String, default: '', nullable: true })
  description: string

  @Column({ type: String, default: '', nullable: true })
  subjectCode: string

  @ManyToMany(() => Group, (group) => group.subjects, { onDelete: 'CASCADE' })
  groups: Group[]

  @UpdateDateColumn()
  updatedAt: string

  @CreateDateColumn()
  createdAt: string
}
