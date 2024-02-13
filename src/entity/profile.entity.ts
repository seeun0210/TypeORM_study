import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserModel, (user) => user.profile)
  //userModel안에 있는 아이디를 프로파일 모델에서 가지고 있겠다.
  //join컬럼을 어디에 두느냐에 따라 레퍼런스하는 아이디 컬럼을 만들게 되는지 정할 수 있다.
  user: UserModel;

  @Column()
  profileImg: string;
}
