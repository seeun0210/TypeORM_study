import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export default class AppController {
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

  @Post('users')
  postUser() {
    return this.userRepository.save({
      role: Role.ADMIN,
    });
  }

  @Get('users')
  getUser() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      },
    });
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
      // title: user.title + '0',
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'cocobell3@naver.com',
    });
    console.log(user);
    await this.profileRepository.save({
      profileImg: 'asdf.jpg',
      user,
    });
    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'typeorm@naver.com',
    });
    await this.postRepository.save({
      title: 'post1',
      author: user,
    });
    await this.postRepository.save({
      title: 'post2',
      author: user,
    });
    return user;
  }

  @Post('posts/tag')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJs Lecture',
    });
    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });
    const tag1 = await this.tagRepository.save({
      name: 'JavaScript',
      posts: [post1, post2],
    });
    const tag2 = await this.tagRepository.save({
      name: 'TypeScript',
      posts: [post1],
    });
    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
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
      relations: { posts: true },
    });
  }
}
