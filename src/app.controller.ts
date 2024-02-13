import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
      //userModel에서 profile에 대해서 eager:true했으니 자동으로 relation되어 가져옴
      // relations: {
      //   profile: true,
      //   posts: true,
      // },
      //===============
      //FindManyOptions 파라미터 알아보기
      //1)select
      //어떤 프로퍼티를 선택할지
      //기본은 모든 프로퍼티를 가져온다(만약에 Select를 정의하지 않으면)
      //select를 정의하면..?
      select: {
        id: true,
        createdAt: true,
        version: true,
        updateAt: true,
        profile: { id: true },
      },
      //id만 가져옴
      //select:{}이렇게 해서 아무값도 넣지 않으면 그냥 다 가져옴
      //==============
      //2)where
      //where안의 것들은 전부 and조건으로!!!
      // where: { version: 1, id: 1 },
      //만약 or조건으로 넣고 싶다면 배열로!!
      // where: [{ version: 1 }, { id: 1 }, { profile: { id: 3 } }],
      //3) 관계를 가져오는 법
      relations: { profile: true },
      //4) 오름차순, 내림차순
      //ASC-> 오름차
      //DESC-> 내림차
      order: {
        id: 'DESC',
      },
      //5) order후 처음 몇개를 제외할 지
      skip: 0,
      //6) take몇개를 가져올지(default(0)는 테이블에 있는것들 전부 다)
      take: 0,
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

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'cocobell3@naver.com',
      //cascade:true로 설정해두었기 때문에 한번에 저정 가능하다
      profile: {
        profileImg: 'asdf.jpg',
      },
    });
    console.log(user);
    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.jpg',
    //   user,
    // });
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
