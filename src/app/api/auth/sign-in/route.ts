import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {NextRequest, NextResponse} from "next/server";
import { z } from "zod";

const emailValidator = z.string().email({message: 'Invalid email format.'})

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'Email and password needed.' }, {status: 400 });
    }

    const emailValidation = emailValidator.safeParse(email);
    if (!emailValidation.success) {
        return NextResponse.json({ message: emailValidation.error.errors[0].message }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return NextResponse.json({ message: 'Email or password invalid', user}, {status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return NextResponse.json({ message: 'Email or password invalid', user}, {status: 401 });
    }

    const response = NextResponse.json({ message: 'Connection successful', user});

    const sessionToken = await createSession(user.id);

    response.cookies.set('user', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
    });

    return response;
}

async function createSession(userId: string): Promise<string> {
    const session = await prisma.session.create({
        data:{
            userId: userId
        }
    });

    return session.token;
}
