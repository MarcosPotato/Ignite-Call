// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { setCookie } from 'nookies'

import { prisma } from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
){

    if(req.method !== "POST"){
        return res.status(405).end()
    }

    const { fullname, username } = req.body

    const userExists = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if(userExists){
        return res.status(400).json({ 
            message: "This username already used" 
        })
    }

    const user = await prisma.user.create({
        data: {
            fullname,
            username,
        },
    })

    setCookie({ res: res }, "@ignitecall:userId", user.id, {
        maxAge: 60 * 60 * 24 * 7, //7 dias
        path: "/",
    })

    return res.status(201).json(user)
}