import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "../auth/dto";



@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
      }
      public async getUserById(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id: id } });
      }
      public async getUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email: email } });
      }
      public async create(userDto: RegisterUserDto): Promise<User> {
        const user = this.userRepository.create(userDto);
        await this.userRepository.save(user);
        return user;
      }

      public async saveToken(userDto: RegisterUserDto, currentHashedRefreshToken:string|null): Promise<User> {
        const user = await this.userRepository.save({
          ...userDto,
          currentHashedRefreshToken: currentHashedRefreshToken,
        });
        return user;
      }
}