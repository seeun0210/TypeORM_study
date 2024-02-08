import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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
  @PrimaryGeneratedColumn()
  id: number;

  //제목
  @Column()
  title: string;

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
