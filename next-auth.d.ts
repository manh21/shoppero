import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { User } from "src/lib/user"

declare module "next-auth" {
  interface Session {
    // what ever properties added, add type here
    user: User
  }
}