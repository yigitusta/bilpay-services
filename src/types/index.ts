export interface ResponseType {
  success: boolean;
  message: string;
  payload?: Object;
}

export class BlockchainError extends Error {}

export class RegistrationError extends Error {}

export class LoginError extends Error {}

export class BilchainError extends Error {}