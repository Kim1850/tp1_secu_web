'use client'

import {useRouter} from "next/navigation";
import React, {useState} from "react";

export default function SignUp() {
    const router = useRouter();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const displayName = `${firstname} ${lastname}`.trim();

            const response = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: displayName,
                    email: email,
                    password: password,
                })
            });

            const data = await response.json();
            const status = response.status;

            if (status === 201) {
                alert("Sign up successfully");
                router.push("/sign-in");
            } else {
                setError(data.message)
            }

        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <form onSubmit={handleSignUp} className="flex flex-col mt-4 px-4 py-2">

                <h2 className="text-xl font-bold mb-4">Sign up</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col mt-4 px-4 py-2 w-full">
                    <label htmlFor="firstname" className="text-left">Firstname:</label>
                    <input
                        className="rounded-3xl p-1 border border-gray-300 focus:outline-none focus:border-blue-500 w-full text-black"
                        id="firstname"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col mt-4 px-4 py-2 w-full">
                    <label htmlFor="lastname" className="text-left">Lastname:</label>
                    <input
                        className="rounded-3xl p-1 border border-gray-300 focus:outline-none focus:border-blue-500 w-full text-black"
                        id="lastname"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col mt-4 px-4 py-2 w-full">
                    <label  className="text-left">Email:</label>
                    <input
                        className="rounded-3xl p-1 border border-gray-300 focus:outline-none focus:border-blue-500 w-full text-black"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col mt-4 px-4 py-2 w-full">
                    <label htmlFor="password" className="text-left">Password:</label>
                    <input
                        className="rounded-3xl p-1 border border-gray-300 focus:outline-none focus:border-blue-500 w-full text-black"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                        type="submit">Sign up
                </button>
            </form>
            <p className="mt-4">
                Already have an account ?{' '}
                <span onClick={() => router.push('/sign-in')} className="text-blue-500 cursor-pointer">
                    Sign in
                </span>
            </p>
        </div>)
}