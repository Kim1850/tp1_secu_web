import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import { z } from 'zod';
import checkAuth from "@/app/api/auth/check-auth";

const prisma = new PrismaClient();

const taskValidator = z.object({
    id: z.string().uuid({message: 'Invalid format.'}),
    completed: z.boolean({message: 'Invalid choice.'}),
});

export async function PUT(req: NextRequest) {

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
        const id = req.nextUrl.pathname.split('/').pop()!;
        const { completed } = await req.json();

        const currentTask: {userId: string} | null = await prisma.task.findUnique({where: {id: id}, select: { userId: true }});

        if (currentTask && userId !== currentTask.userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const taskValidation = taskValidator.safeParse({id, completed});
        if (!taskValidation.success) {
            return NextResponse.json({message: taskValidation.error.errors[0].message}, {status: 400});
        }

        const updatedTask = await prisma.task.update({
            where: {id} ,
            data: { completed },
            select: {
                id: true,
                content: true,
                completed: true,
            },
        });

        return NextResponse.json({task: updatedTask}, {status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error while updating task" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    let userId:string;
    try{
        userId = await checkAuth(req.cookies.get("user")?.value);
    } catch (error){
        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 401});
        }
        return NextResponse.json({message: "Not authenticated"}, {status: 401});
    }

    const id = req.nextUrl.pathname.split('/').pop()!;

    if (!id) {
        return NextResponse.json({ message: "ID not provided" }, { status: 400 });
    }

    const currentTask: {userId: string} | null = await prisma.task.findUnique({where: {id: id}, select: { userId: true }});

    if (currentTask && userId !== currentTask.userId) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const idValidator = z.string().uuid({ message: 'Invalid ID format.' });
    const idValidation = idValidator.safeParse(id);

    if (!idValidation.success) {
        return NextResponse.json(
            { message: idValidation.error.errors[0].message },
            { status: 401 }
        );
    }

    try {
        await prisma.task.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
    }
}
