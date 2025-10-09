export {};

declare global {
  namespace Express {
    export interface IAuthUser {
      _id: string;
      name: string;
      email: string;
      role: "manager" | "student";
    }

    export interface Request {
      user?: IAuthUser;
    }
  }
}
