import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();


export default async function checkAuth( sessionToken: string | undefined): Promise<string> {

    if (!sessionToken) {
        return Promise.reject(new Error("Session token is missing"));
    }

    console.log("Cookie user:", sessionToken);

    const session = await prisma.session.findUnique({
        where: {
            token: sessionToken
        }
    });

    if (session === null){
        return Promise.reject(new Error("Invalid User"));
    }

    const _MS_PER_HOUR = 1000 * 60 * 60 * 24;
    const tokenAge = Date.UTC(Date.now()) - Date.UTC(session.createdAt.getUTCDate())

    if (tokenAge > _MS_PER_HOUR){
        prisma.session.deleteMany({
            where: {
                token: sessionToken
            }
        });
        return Promise.reject(new Error("Session expired"));
    }

    return Promise.resolve(session.userId);
}