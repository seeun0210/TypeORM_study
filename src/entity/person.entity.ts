import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
//Entity Embedding
export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}
@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   firstName: string;

  //   @Column()
  //   lastName: string;
  // 중복되는걸 프로퍼티를 클래스로 선언(이 클래스에는 @Entity()어노테이션 붙이면 안됨
  // 이렇게 해서 Entity Embedding 할 수 있다!
  @Column(() => Name)
  name: Name;

  @Column()
  class: string;
}

@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   firstName: string;

  //   @Column()
  //   lastName: string;
  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;
}
