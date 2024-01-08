import { Group } from 'src/groups/entities/group.entity'
import { User } from 'src/users/entities/user.entity'
import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Group, (group) => group.students, {
    onDelete: 'SET NULL',
    nullable: true
  })
  group: Group
}
