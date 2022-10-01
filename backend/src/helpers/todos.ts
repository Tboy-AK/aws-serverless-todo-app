import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodosAccess } from './todosAccess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

// TODO: Implement businessLogic
export const createTodo = (newTodo: CreateTodoRequest, userId: string) => {
  const todoItem = {}
  return todoItem
}

// TODO: Implement businessLogic
export const deleteTodo = (newTodo: string, userId: string) => {
  const todoItem = {}
  return todoItem
}
