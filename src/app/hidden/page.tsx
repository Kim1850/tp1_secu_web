'use client'

import React, {useEffect, useState} from "react";
import TodoList from "@/app/components/todo-list";
import Navbar from "@/app/components/navbar";
import { useRouter} from "next/navigation";

interface user {
    id: string;
    name: string;
    email: string;
}

export default function Hidden() {
    const [user, setUser] = useState<user | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.status === 200) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error("Query error : ", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserData();
    }, [router]);

    const handleSignOut = async () => {
        const response = await fetch("/api/auth/sign-out", {method: "POST"});
        if (response.status === 200) {
            router.push("/");
        }
    };

    const loadingBody = (
                <p>Loading...</p>
        );

    const userNotFoundBody = (
                <p>No user found.</p>
        );

    const todoBody = (user: user)=>(
            <div>
                <p>Congratulations <b>{user.name}</b>, you have accessed the hidden page</p>
                <p>If you want to sign out click on button below : </p>

                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                        onClick={handleSignOut}>
                    Sign out
                </button>
                <TodoList userId={user.id}/>
            </div>
        );

    let pageBody;

    if (isLoading) pageBody = loadingBody;
    else if (!user) pageBody = userNotFoundBody;
    else pageBody = todoBody(user);

    return (
        <div>
            <Navbar/>
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                {pageBody}
            </div>
        </div>
    );
}