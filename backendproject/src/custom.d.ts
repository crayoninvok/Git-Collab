import { Role, User } from "@prisma/client";
import { Request } from "express";
import 'express'

export type UserPayload = {
    id: number
    role:Role
}

declare global {
    namespace Express{
        export interface Request{
            user?:UserPayload
        }
    }
}