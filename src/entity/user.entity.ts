import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity()
export class UserModel {
  //ID
  //자동으로 ID를 생성한다.

  //@PrimaryGeneratedColumn()
  //Primary Column은 모든 테이블에서 기본적으로 존재한다
  //테이블안에서 각각의 Row를 구분할 수 있는 컬럼이다.
  //@PrimaryColumn

  //UUID
  //adafadfasfafasf-asdfasdfasdfasgfasdf-asdfasdfasdfasf-afdasf
  //기본적으로 unique한 값
  @PrimaryGeneratedColumn()
  id: number;

  //제목
  @Column({
    //데이터 베이스에서 인지하는 칼럼 타입
    //자동으로 유추됨
    type: 'varchar',
    //데이터베이스 칼럼 이름
    //프로퍼티 이름으로 자동 유추됨
    name: 'title',
    //값의 길이
    //입력할 수 있는 글자의 길이가 300
    length: 300,
    //null이 가능한지
    nullable: true,
    //true면 처음 저장할때만 값 지정 가능
    //이후에는 값 변경 불가능,
    update: false,
    //find()를 실행할 때 기본으로 값을 불러올지
    //default: true
    //false일때 따로 가져오려면 find함수내에서 조작해야함
    //.find({select:{title:true}})
    select: false,
    //기본값
    //아무것도 입력 안했을 때 기본으로 입력되게 되는 값
    default: 'default title',
    // 컬럼 중에서 유일무이한 값이 돼야하는지
    unique: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  //데이터 생성 일자
  //데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
  @CreateDateColumn()
  createdAt: Date;

  //데이터 업데이트 일자
  //데이터가 업데이트되는 날짜와 시간이 자동으로 찍힌다.
  @UpdateDateColumn()
  updateAt: Date;

  //데이터가 업데이트 될떄마다 1씩 올라간다
  //처음 생성되면 값은 1이다
  //save()함수가 몇 번 불렸는지 기억한다.
  @VersionColumn()
  version: number;

  @Column()
  @Generated('uuid')
  additionalId: string;
}
