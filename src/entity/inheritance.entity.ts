// 1. 평범한 형태의 inheritance

import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

// 상속을 받으면 상속받은 크래스들이 각각 개별의 테이블을 생성하는 Inheritance
// BaseModel은 entity등록을 하지 않는다.
export class BaseModel {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
// BaseModel의 속성을 상속받아 id, createAt, updateAt 컬럼이 자동으로 생성된다.
@Entity()
export class BookModel extends BaseModel {
  @Column()
  name: string;
}

@Entity()
export class CarModel extends BaseModel {
  @Column()
  brand: string;
}

// 2. single table inheritance
// 사용하는 방법은 같지만, 실제 테이블이 생기는 형태는 하나의 테이블로 모든 엔티티들이 관리
//얘는 엔티티로 등록을 해준다
@Entity()
//그리고 상속받는 컬럼의 name을 type으로 지정하고, type의 type은 varchar이다.
//이렇게 하면 singleBaseModel을 상속받은
//computerModel의 컬럼과 airplane모델의 컬럼의 합집합이
//singleBaseModel의 컬럼이 된다.
@TableInheritance({
  column: {
    name: 'type',
    type: 'varchar',
  },
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
//상속받는 엔티티에는 @ChildEntity()어노테이션을 붙여준다.
@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  brand: string;
}

@ChildEntity()
export class AirplaneModel extends SingleBaseModel {
  @Column()
  country: string;
}

//정리해보면,
//일반적인 Inheritance table 방법은
//공통되는 컬럼들을 class로 선언해서 넣어주는 방법이고
//이걸 따로 테이블로 만들지는 않는다
//하지만,
//singleBaseModel의 @ChildEntity()들을 한꺼번에 관리할 수 있는
//합집합 엔티티가 생기는거라 볼 수 있다.
