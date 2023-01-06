import { NextApiRequest, NextApiResponse } from "next"
import { Adapter } from "next-auth/adapters"
import { parseCookies, destroyCookie } from "nookies"

import { prisma } from "../prisma"

export function PrismaAdapter(
  req: NextApiRequest, 
  res: NextApiResponse
): Adapter {
  return {
    async createUser(user) {
      const { "@ignitecall:userId": userIdOnCookies } = parseCookies({ req })

      if(!userIdOnCookies){
        throw new Error("User id not found on cokkies")
      }

      const prismaUser = await prisma.user.update({
        where: { id: userIdOnCookies },
        data: {
          fullname: user.name as string,
          email: user.email,
          avatar_url: user.avatar_url,
        }
      })

      destroyCookie({ res }, "@ignitecall:userId", {
        path: "/"
      })

      return {
        id: prismaUser.id,
        name: prismaUser.fullname,
        username: prismaUser.username,
        email: prismaUser.email!,
        avatar_url: prismaUser.avatar_url!,
        emailVerified: null,
        fullname: prismaUser.fullname
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if(!user){
        return null
      }

      return {
        id: user.id,
        name: user.fullname,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        fullname: user.fullname
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if(!user){
        return null
      }

      return {
        id: user.id,
        name: user.fullname,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        fullname: user.fullname
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {

      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId
          }
        },
        include: {
          user: true
        }
      })

      if(!account){
        return null
      }

      const { user } = account

      return {
        id: user.id,
        name: user.fullname,
        username: user.username,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        fullname: user.fullname
      }
    },

    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id! },
        data: {
          fullname: user.name as string,
          email: user.email,
          avatar_url: user.avatar_url,
        }
      })

      return {
        id: updatedUser.id,
        name: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email!,
        avatar_url: updatedUser.avatar_url!,
        emailVerified: null,
        fullname: updatedUser.fullname!
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state
        }
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken
        }
      })

      return{
        sessionToken,
        userId,
        expires
      }
    },

    async getSessionAndUser(sessionToken) {
      const sessionPrisma = await prisma.session.findUnique({
        where: {
          session_token: sessionToken
        },
        include: {
          user: true
        }
      })

      if(!sessionPrisma){
        return null
      }

      const { user, ...session } = sessionPrisma

      return{
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token
        },
        user: {
          id: user.id,
          name: user.fullname,
          username: user.username,
          email: user.email!,
          avatar_url: user.avatar_url!,
          emailVerified: null,
          fullname: user.fullname
        }
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const primaSession = await prisma.session.update({
        where: { session_token: sessionToken! },
        data: {
          expires,
          user_id: userId
        }
      })

      return {
        sessionToken: primaSession.session_token,
        userId: primaSession.user_id,
        expires: primaSession.expires
      }
    },

    async deleteSession(sessionToken){
      await prisma.session.delete({
        where: {
          session_token: sessionToken
        }
      })
    }
  }
}