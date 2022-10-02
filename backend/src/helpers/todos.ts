import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { createLogger } from '../utils/logger'
import { TodosAccess } from './todosAccess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

// TODO: Implement businessLogic
export const createTodo = (newTodo: CreateTodoRequest, userId: string) => {
  const todoItem: TodoItem = {
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    attachmentUrl: '',
    createdAt: new Date().toISOString(),
    done: false,
    userId,
    todoId: uuid.v4()
  }
  const newTodoItem = new TodosAccess().createTodo(todoItem)
  return newTodoItem
}

export const deleteTodo = (todoId: string, userId: string) => {
  const todoItem = {}
  return todoItem
}

export const updateTodo = (
  todoUpdate: UpdateTodoRequest,
  todoId: string,
  userId: string
) => {
  const todoKey = { userId, todoId }
  const newTodoItem = new TodosAccess().updateTodo(todoUpdate, todoKey)
  return newTodoItem
}

export const getTodosForUser = (userId: string): Array<object> => {
  const todoItem = []
  return todoItem
}

export const createAttachmentPresignedUrl = (
  todoId: string,
  userId: string
): string => {
  const presignedUrl = ''
  return presignedUrl
}
