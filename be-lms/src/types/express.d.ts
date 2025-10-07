interface IAuthUser {
  _id: string;
  name: string;
  email: string;
  role: "manager" | "student";
}

declare namespace Express {
  export interface Request {
    user?: IAuthUser;
  }
}
