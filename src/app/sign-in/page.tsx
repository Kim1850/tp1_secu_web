"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function SignIn() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            const data = await response.json();
            const status = response.status;

            if (status === 200) {
                router.push("/hidden");
            } else {
                setError(data.message)
            }
        } catch (error) {
            setError((error as Error).message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <form onSubmit={handleSignIn} className="flex flex-col mt-4 px-4 py-2">
                <h2 className="text-xl font-bold mb-4">Sign In</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex flex-col mt-4 px-4 py-2 w-full">
                    <label htmlFor="email" className="text-left">Email:</label>
                    <input
                        className="rounded-3xl p-1 border border-gray-300 focus:outline-none focus:border-blue-500 w-full text-black"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    />
                </div>
                <button
                    className="mt-4 px-2 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                    type="submit"
                >
                    Sign in
                </button>
            </form>
            <p className="mt-4">
                You don’t have an account?{" "}
                <span onClick={() => router.push("/sign-up")} className="text-blue-500 cursor-pointer">
                    Sign up
                </span>
            </p>
        </div>
    );
}
