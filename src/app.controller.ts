import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
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
  @Post('sample')
  async sample() {
    //모델에 해당되는 객체 생성-저장은 안함(리턴하면 값을 받아볼 수는 있지만 db에 저장은 안됨)
    const user1 = this.userRepository.create({
      email: 'test@codefactory.ai',
    });

    //저장
    const user2 = this.userRepository.save({ email: 'test@codefactory.ai' });
    // return user2;

    //preload
    //입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    //추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함
    //저장하지는않음(뭐랄까 find와 create가 섞인 상태??)
    const user3 = await this.userRepository.preload({
      id: 101,
      email: 'codefactory@codefactory.ai',
    });
    //return user3;

    //삭제하기
    // await this.userRepository.delete(101);

    //id가 2인 row의 count를 2씩 증가
    // const user4 = await this.userRepository.increment(
    //   {
    //     id: 2,
    //   },
    //   'count',
    //   2,
    // );
    // return user4;

    //감소시키기
    // const user5 = await this.userRepository.decrement(
    //   {
    //     id: 2,
    //   },
    //   'count',
    //   3,
    // );
    // return user5;

    //갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike(`%0%`),
    //   },
    // });
    // return count;

    //sum (0을 포함하는 모든 row의 count의 합계)
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });
    // return sum;

    //평균
    // const average = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });
    // return average;

    //최솟값 count가 가장 작은 Row의 count 값
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });
    // return min;

    //최댓값
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });
    // return max;

    //페이지 네이션 기초
    //배열의 마지막에 숫자가 옴-> 전체에 해당되는 갯수임!!
    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });
    return usersAndCount;
  }
  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
  }

  @Get('users')
  getUsers() {
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
      // select: {
      //   id: true,
      //   createdAt: true,
      //   version: true,
      //   updateAt: true,
      //   profile: { id: true },
      // },
      //id만 가져옴
      //select:{}이렇게 해서 아무값도 넣지 않으면 그냥 다 가져옴
      //==============
      //2)where
      //where안의 것들은 전부 and조건으로!!!
      // where: { version: 1, id: 1 },
      //만약 or조건으로 넣고 싶다면 배열로!!
      // where: [{ version: 1 }, { id: 1 }, { profile: { id: 3 } }],
      where: {
        //id가 1이 아닌 경우 가져오기
        // id: Not(1),
        //id가 30보다 적은경우 가져오기
        // id: LessThan(30),
        //30보다 작거나 같은 경우
        // id: LessThanOrEqual(30),
        //30보다 큰 경우
        // id: MoreThan(30),
        //30과 같거나 큰 경우
        // id: MoreThanOrEqual(30),
        //같은 경우: 그냥 30을 넣는거나 다를 바가 없음
        // id: Equal(30),
        //유사값 가져오기(google이라는 글자가 들어가 있으면 앞뒤로 어떤글자가 와도 상관없음)
        // email: Like('%google%'),
        //대문자 소문자 구분 안하는 유사값
        // email: ILike('%gooGLe%'),
        //사이값(10부터 15까지의 값 필터링)
        // id: Between(10, 15),
        //해당되는 여러개의 값
        // id: In([1, 3, 5, 7, 9]),
        //isNull null인것들 가져오기
        // id: IsNull(),
      },
      //3) 관계를 가져오는 법
      // relations: { profile: true },
      //4) 오름차순, 내림차순
      //ASC-> 오름차
      //DESC-> 내림차
      // order: {
      //   id: 'DESC',
      // },
      //5) order후 처음 몇개를 제외할 지
      // skip: 0,
      //6) take몇개를 가져올지(default(0)는 테이블에 있는것들 전부 다)
      // take: 0,
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
