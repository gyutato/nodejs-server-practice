import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column()
  @Generated('uuid')
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    /** if true, get the relation with find() method by default */
    eager: false,
    /** if true, save the relation whenever the entity is saved */
    cascade: true,
    /** determines the policy for the deletion */
    /** onDelete: 'CASCADE' only takes effect when the column is joined by @JoinColumn() (https://github.com/typeorm/typeorm/issues/3218) */
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @Column({
    default: 0,
  })
  count: number;
}
