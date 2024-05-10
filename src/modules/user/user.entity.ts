//user.entity.ts
import { IsDate, IsEmail, Min } from 'class-validator';
import * as moment from 'moment';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Min(0)
  password: string;

  @Column({
    type:Date,
    default: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    nullable:true,
  }) 
  @IsDate()
  createdAt: Date;



  @Column({
    type: Date,
    default: moment(new Date()).format('YYYY-MM-DD HH:ss'),
    nullable: true,
  })
  @IsDate()
  updatedAt: Date;

}
