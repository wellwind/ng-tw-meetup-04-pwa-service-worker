import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoItem } from './todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private httpClient: HttpClient) {}

  getTodoList() {
    return this.httpClient.get<TodoItem[]>('http://localhost:3000/todos');
  }

  addTodo(todoItem: TodoItem) {
    return this.httpClient.post<TodoItem>('http://localhost:3000/todos', todoItem);
  }

  toggleTodo(todoItem: TodoItem) {
    return this.httpClient.put<TodoItem>(`http://localhost:3000/todos/${todoItem.id}`, { ...todoItem, done: !todoItem.done });
  }
}
