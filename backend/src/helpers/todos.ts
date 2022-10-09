import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { createLogger } from '../utils/logger'
import { TodosAccess } from './todosAccess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('auth')

// TODO: Implement businessLogic
export const createTodo = async (
  newTodo: CreateTodoRequest,
  userId: string
) => {
  const todoId = uuid.v4()
  const attachmentUrl = createAttachmentPresignedUrl(todoId, userId)
  const todoItem: TodoItem = {
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    attachmentUrl,
    createdAt: new Date().toISOString(),
    done: false,
    userId,
    todoId
  }

  await new TodosAccess().createTodo(todoItem)
  logger.info('Create Todo Successful')

  const result = { ...todoItem }

  delete result.userId

  return result
}

export const deleteTodo = async (todoId: string, userId: string) => {
  const todoKey = { userId, todoId }
  await new TodosAccess().deleteTodo(todoKey)
}

export const updateTodo = async (
  todoUpdate: UpdateTodoRequest,
  todoId: string,
  userId: string
) => {
  const todoKey = { userId, todoId }
  await new TodosAccess().updateTodo(todoUpdate, todoKey)
  logger.info('Update Todo Successful')
}

export const getTodosForUser = async (userId: string) => {
  const todoItems = await new TodosAccess().getTodosForUser(userId)
  logger.info('Get Todo Successful')
  const results = todoItems.map((item) => {
    const result = {
      todoId: item.todoId.S,
      name: item.name.S,
      dueDate: item.dueDate.S,
      attachmentUrl: item.attachmentUrl.S,
      createdAt: item.createdAt.S,
      done: item.done.BOOL
    }
    return result
  })
  return results
}

export const createAttachmentPresignedUrl = (
  todoId: string,
  userId: string
) => {
  const imageId = `${userId}/${todoId}`
  const presignedUrl = new AttachmentUtils().createAttachmentPresignedUrl(
    imageId
  )
  logger.info('Generate Presigned URL Successful')
  return presignedUrl
}
