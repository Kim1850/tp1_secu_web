"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

function Snowfall() {
    const [flakes, setFlakes] = useState<number[]>([]);
    const router = useRouter();

    useEffect(() => {
        setFlakes(new Array(50).fill(0).map((_, i) => i));
    }, [router]);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {flakes.map((flake) => (
                <div
                    key={flake}
                    className="absolute bg-white rounded-full opacity-70"
                    style={{
                        width: `${Math.random() * 5 + 5}px`,
                        height: `${Math.random() * 5 + 5}px`,
                        left: `${Math.random() * 100}vw`,
                        animation: `fall ${Math.random() * 5 + 5}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default function Page() {
    const router = useRouter();

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-center relative bg-blue-900 text-white">
            <Snowfall/>
            <h2>Welcome to SnowDo</h2>
            <p>The best to-do app when it snows outside</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                type="button"
                onClick={() => router.push("/sign-in")}
            >
                Sign in
            </button>
        </div>
    );
}
