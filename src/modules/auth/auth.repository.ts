// import {  DataSource, Repository } from "typeorm";
// import { User } from "../user/user.entity"
// import * as bcrypt from 'bcrypt';
// import { InjectRepository } from "@nestjs/typeorm";
// import { Injectable } from "@nestjs/common";




// @Injectable()
// export class AuthRepository {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}


  
//     public async getUserById(id: string): Promise<User> {
//         return await this.userRepository.findOne({ where: { id: id } });
//       }
    
    
//     public async updateRefreshToken(
//         user: User,
//         currentHashedRefreshToken: string,
//       ) {
//         console.log(this)
//         console.log(currentHashedRefreshToken)

//         await this.userRepository.save({
//           ...user,
//           currentHashedRefreshToken: currentHashedRefreshToken,
//         });
//         return user;
//       }
    
//         public async getUserIfRefreshTokenMatches(
//             refreshToken: string,
//             userId: string,
//         ) {
//             const user = await this.getUserById(userId);

//             const isRefreshTokenMatching = await bcrypt.compare(
//                 refreshToken,
//                 user.currentHashedRefreshToken,
//             )

//             if (isRefreshTokenMatching) {
//                 return user;
//             }

//             return null;

//         }

//         public async clearRefreshToken(user: User) {
//             await this.userRepository.save({
//               ...user,
//               currentHashedRefreshToken: null,
//             });
//             return user;
//           }
        
    
// }