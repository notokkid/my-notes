import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  onUserCreate() {
    console.log('Created user with ID: ', this.id);
  }

  @AfterUpdate()
  onUserUpdate() {
    console.log('Updated user with ID: ', this.id);
  }

  @AfterRemove()
  onUserDelete() {
    console.log('Deleted user with ID: ', this.id);
  }
}
