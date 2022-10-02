import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { createLogger } from '../utils/logger'
import { TodosAccess } from './todosAccess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

// TODO: Implement businessLogic
export const createTodo = async (
  newTodo: CreateTodoRequest,
  userId: string
) => {
  const todoItem: TodoItem = {
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    attachmentUrl: '',
    createdAt: new Date().toISOString(),
    done: false,
    userId,
    todoId: uuid.v4()
  }
  const newTodoItem = await new TodosAccess().createTodo(todoItem)
  return newTodoItem
}

export const deleteTodo = async (todoId: string, userId: string) => {
  const todoKey = { userId, todoId }
  const deletedTodoItem = await new TodosAccess().deleteTodo(todoKey)
  return deletedTodoItem
}

export const updateTodo = async (
  todoUpdate: UpdateTodoRequest,
  todoId: string,
  userId: string
) => {
  const todoKey = { userId, todoId }
  const updatedTodoItem = await new TodosAccess().updateTodo(
    todoUpdate,
    todoKey
  )
  return updatedTodoItem
}

export const getTodosForUser = async (userId: string) => {
  const todoItems = await new TodosAccess().getTodosForUser(userId)
  return todoItems
}

export const createAttachmentPresignedUrl = (
  todoId: string,
  userId: string
): string => {
  const presignedUrl = ''
  return presignedUrl
}
