/**
 * User model representing a user in the system
 */
export type UserModel = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isApprover: boolean;
  externalId: string;
}

/**
 * User role enumeration
 */
export enum UserRoleEnum {
  APPROVER = 'APPROVER',
  ADMIN = 'ADMIN'
}
