import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import checkAuth from "@/app/api/auth/check-auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    let userId:string;
    try{
        userId = await checkAuth(req.cookies.get("user")?.value);
    }
    catch (error){
        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 401});
        }
        return NextResponse.json({message: "Not authenticated"}, {status: 401});
    }

    if (!userId) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
}
