export type UserModel = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string,
  isApprover: boolean,
  externalId: string,
}

export enum UserRoleEnum {
  APPROVER = 'APPROVER',
  ADMIN = 'ADMIN'
}
