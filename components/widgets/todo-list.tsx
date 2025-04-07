'use client'

import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FaList, FaPlus, FaTrash } from 'react-icons/fa'

interface Todo {
    id: string
    text: string
    completed: boolean
}

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState('')

    // Load todos from localStorage on mount
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos')
        if (savedTodos) {
            try {
                setTodos(JSON.parse(savedTodos))
            } catch {
                console.error('Failed to parse todos from localStorage')
            }
        }
    }, [])

    // Save todos to localStorage when they change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    const addTodo = () => {
        if (newTodo.trim() === '') return

        const todo: Todo = {
            id: Date.now().toString(),
            text: newTodo,
            completed: false,
        }

        setTodos([...todos, todo])
        setNewTodo('')
    }

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        )
    }

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id))
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">Todo List</CardTitle>
                <FaList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            No tasks yet. Add one below!
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {todos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`todo-${todo.id}`}
                                            checked={todo.completed}
                                            onCheckedChange={() =>
                                                toggleTodo(todo.id)
                                            }
                                        />
                                        <label
                                            htmlFor={`todo-${todo.id}`}
                                            className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                                        >
                                            {todo.text}
                                        </label>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteTodo(todo.id)}
                                        aria-label="Delete todo"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex space-x-2 p-4 pt-0">
                <Input
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addTodo()
                        }
                    }}
                />
                <Button size="icon" onClick={addTodo} aria-label="Add todo">
                    <FaPlus className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
