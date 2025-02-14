import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    console.log("Middleware exécuté sur :", req.nextUrl.pathname);

    const userCookie = req.cookies.get("user")?.value;
    console.log("Cookie user:", userCookie);

    const protectedRoutes = ["/hidden", "/profile"];

    if (!userCookie && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        console.log("redirection vers /sign-in");
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (userCookie && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        console.log("reste sur /hidden");
        return NextResponse.redirect(new URL("/hidden", req.url));
    }

    console.log("Accès autorisé !");
    return NextResponse.next();
}

export const config = {
    matcher: ["/hidden", "/profile"],
};
