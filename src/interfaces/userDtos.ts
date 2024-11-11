export class CreateUserDto {
  login: string;
  password: string;
}
export class UpdateUserDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}
