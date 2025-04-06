import {NextRequest, NextResponse} from 'next/server';
import checkAuth from "@/app/api/auth/check-auth";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {

    const sessionToken = req.cookies.get("user")?.value;

    try{
        await prisma.session.delete({
            where:{
                token:sessionToken,
            }
        });
    }catch(e){}

    const response = NextResponse.json({ message: 'Sign out successful'});

    response.cookies.set('user', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,  // Set the cookie to expire immediately
        path: '/',
    });

    return response;
}
