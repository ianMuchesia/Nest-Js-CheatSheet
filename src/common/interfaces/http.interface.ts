import { User } from "src/modules/user/user.entity";

export interface IRequestWithUser {
  user?: User;
}

