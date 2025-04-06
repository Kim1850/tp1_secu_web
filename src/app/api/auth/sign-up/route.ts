import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const nameValidator = z.string().regex(/^[a-zA-Z\s]+$/, {
    message: "Name must only contain letters.",
});

const passwordValidator  = z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character." });

const userCreateSchema = z.object({
    name: nameValidator,
    email: z.string().email({message: 'Invalid email format. a@a.a requested.'}),
    password: passwordValidator,
})

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const userCreateValidation = userCreateSchema.safeParse({
        name: name,
        email: email,
        password: password
    });

    if (!userCreateValidation.success) {
        return NextResponse.json({ message: userCreateValidation.error.errors[0].message }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return NextResponse.json({ message: 'This email is already used.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: 'User created', user}, {status: 201});
}
