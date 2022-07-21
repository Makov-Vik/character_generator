import { User } from 'src/user/user.model';

interface UserLastLogin extends User {
  lastLogin: string;
  tokenId: string;
}
