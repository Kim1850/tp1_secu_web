import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import checkAuth from "@/app/api/auth/check-auth";

const prisma = new PrismaClient();

const contentValidator = z.string().regex(
    /^[a-zA-Z0-9<>[\]{}!@#$%^&*()\-+=_,\s]+$/,
    { message: 'Invalid content format.' }
);

const taskValidator = z.object({
    content: contentValidator,
    userId: z.string().uuid({ message: 'Invalid userId format.' }),
});

export async function GET(req: NextRequest) {

    let userId:string;
    try{
        userId = await checkAuth(req.cookies.get("user")?.value);
    } catch (error){
        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 401});
        }
        return NextResponse.json({message: "Not authenticated"}, {status: 401});
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                content: true,
                completed: true,
            },
        });

        return NextResponse.json({tasks: tasks},{ status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {

    let userId:string;
    try{
        userId = await checkAuth(req.cookies.get("user")?.value);
    } catch (error){
        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 401});
        }
        return NextResponse.json({message: "Not authenticated"}, {status: 401});
    }

    try {
        const { content } = await req.json();

        const validationResult = taskValidator.safeParse({ content, userId });
        if (!validationResult.success) {
            return NextResponse.json(
                { message: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }

        const newTask = await prisma.task.create({
            data: { content: content, userId },
            select: { id: true, content: true, completed: true },
        });

        return NextResponse.json({ message: newTask}, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ message: "Error creating task" }, { status: 500 });
    }
}
