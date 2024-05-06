import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { ProfileModel } from './entities/profile.entity';
import { PostModel } from './entities/post.entity';
import { TagModel } from './entities/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  /** ----------------------------------------------------------------------
   *  common method practice
   *  -------------------------------------------------------------------- */
  @Post('practice')
  async practice() {
    /** create an object with given parameter, bind to the repository. Does NOT save the object. */
    const userCreate = await this.userRepository.create({
      email: 'create@example.io',
    });

    /** create an object with given parameter and save at the DB - rest of the columns would be auto-filled */
    const userSave = await this.userRepository.save({
      email: 'create@example.io',
    });

    /** Loads values from the DB, updates the value. Does NOT save the object. */
    /** The given entity-like object must have a primary key to find entity by. */
    const userPreload = await this.userRepository.preload({
      id: 100,
      email: 'create@example.io',
    });

    /** Deletes the record with the given key */
    const userDelete = await this.userRepository.delete(100);

    /** Increments the filtered values by the given amount. Same for .decrement() */
    const userIncrement = await this.userRepository.increment(
      {
        id: 1,
      },
      'count',
      2,
    );

    /** Counts the length of the filtered values */
    const userCount = await this.userRepository.count({
      where: {
        email: Like('%0%'),
      },
    });

    /** Sums up the filtered values */
    const userSum = await this.userRepository.sum('count', {
      email: Like('%0%'),
    });

    /** Sums up the filtered values */
    const userFindAndCount = await this.userRepository.findAndCount({
      take: 3,
    });
  }

  /** ----------------------------------------------------------------------
   *  REST API practice
   *  -------------------------------------------------------------------- */
  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        email: Like('%0%'),
      },
    });
  }

  @Post('users')
  postUsers() {
    return this.userRepository.save({});
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const userWithProfile = await this.userRepository.save({
      email: 'asdf@example.io',
      /** if cascade is false, profile will not be updated by updating userRepository. */
      profile: {
        profileImg: 'default.png',
      },
    });

    return userWithProfile;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'post@example.io',
    });

    await this.postRepository.save({
      author: user,
      title: 'First Post',
    });

    await this.postRepository.save({
      author: user,
      title: 'Second Post',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'first tag test',
    });

    const post2 = await this.postRepository.save({
      title: 'second tag test',
    });

    const tag1 = await this.tagRepository.save({
      name: 'tagA',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'tagB',
      posts: [post1],
    });

    const post3 = await this.tagRepository.save({
      name: 'tagB',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('users/dummy')
  async createDummyUsers() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@example.io`,
      });
    }
  }
}
