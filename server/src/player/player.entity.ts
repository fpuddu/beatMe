import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Challenge } from '../challenge/challenge.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Challenge, (c) => c.sender)
  sentChallenges: Challenge[];

  @OneToMany(() => Challenge, (c) => c.receiver)
  receivedChallenges: Challenge[];
}
