import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  title: string;

  @Column()
  excerpt: string;

  @Column()
  text: string;

  @Column()
  primaryTag: string;

  @Column()
  dateCreated: Date;

  @Column()
  tags: string[];
}
