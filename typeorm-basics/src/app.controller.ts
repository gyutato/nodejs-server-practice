import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
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

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
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
}
