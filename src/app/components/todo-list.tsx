'use client'
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";

interface Todo {
    id: string;
    content: string;
    completed: boolean;
}

export default function TodoList({userId}: { userId: string }) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`/api/task?userId=${userId}`, {credentials: "include"});

                if (response.status === 200) {
                    const body = await response.json();
                    setTodos(body.tasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTodos();
    }, [userId]);

    const addTodo = async () => {
        if (input.trim()) {
            const newTodo = {
                content: input,
                userId: userId,
                completed: false,
            };

            try {
                const response = await fetch("/api/task", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(newTodo),
                });
                const status = response.status;

                const content = await response.json();
                const newTask = content.message;

                if (status === 201) {
                    setTodos((prevTodos) => {
                        return [...prevTodos, newTask];
                    });

                } else if(response.status === 401){
                    router.push('/');
                }else {
                    console.log("contettttt: ", newTask);
                    setErrorMessage(newTask);
                }

                setInput("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };

    const toggleTodo = async (id: string) => {
        const todoToUpdate = todos.find((todo) => todo.id === id);
        if (!todoToUpdate) return;

        try {
            const updatedCompleted = !todoToUpdate.completed;

            const response = await fetch(`/api/task/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({completed: updatedCompleted}),
            });

            if (response.status === 200) {
                const data = await response.json();
                const updatedTask = data.task;
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id ? updatedTask : todo
                    )
                );
            } else if(response.status === 401){
                router.push('/');
            } else {
                console.error("Failed to update task");
            }
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const removeTodo = async (id: string) => {
        const response = await fetch(`/api/task/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.status === 204) {
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } else if( response.status === 401){
            router.push('/');
        }
        else {
            console.error("Failed to delete task");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-16 text-center">
            <h1 className="text-2xl font-bold">Todo List</h1>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <div className="mt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter new todo"
                    className="p-2 border border-gray-300 text-black rounded-3xl"
                />
                <button
                    onClick={addTodo}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-3xl"
                >
                    Add Todo
                </button>
            </div>

            <ul className="mt-6">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`flex items-center justify-between mt-2 ${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                        <span>{todo.content}</span>
                        <div>
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className="mx-2 p-1 bg-green-500 text-white rounded-3xl"
                            >
                                {todo.completed ? "Undo" : "Complete"}
                            </button>
                            <button
                                onClick={() => removeTodo(todo.id)}
                                className="p-1 bg-red-500 text-white rounded-3xl"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
