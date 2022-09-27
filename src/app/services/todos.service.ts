import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private baseURL = environment['apiURL'];
  public todos: any = [];

  public selectedTodo = {
    todoId: null,
    todoTitle: '',
    todoItems: []
  }

  public todoItemInput = '';
  public isTodoItemsLoading = false;

  public totalPages = 0;
  public pageNumbers: any = [];
  public selectedPage = 1;

  constructor(public http: HttpClient) { }

  getTodos() {
    this.todos = [];
    this.getTodosFromAPI().subscribe({
      next: (data: any) => {
        this.totalPages = data['totalPages'];
        for(const todo of data['result']) {
          this.todos.push(todo)
        }
        this.setPagination();
      },
      error: err => {
        console.log(err)
      }
    })
  }

  setPagination() {
    this.pageNumbers = [];
    if(this.totalPages == 0) {
      this.pageNumbers = [];
      return;
    }

    if(this.totalPages <= 2) {
      this.pageNumbers = [1,2];
      return;
    }

    if(this.selectedPage - 1 > 1) {
      this.pageNumbers.push(this.selectedPage - 1)
    }

    if(this.selectedPage > 1 && this.selectedPage < this.totalPages) {
      this.pageNumbers.push(this.selectedPage)
    }

    if(this.selectedPage + 1 < this.totalPages) {
      this.pageNumbers.push(this.selectedPage + 1)
    }
  }

  getTodosFromAPI() {
    const token = this.getToken();
    return this.http.get(this.baseURL + "/todos?page="+this.selectedPage, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  }

  addTodo(todo: any) {
    const token = this.getToken();
    return new Promise((res, rej) => {
      this.http.post(this.baseURL + "/todos/add", todo ,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: data => {
          return res(data);
        },
        error: err => {
          return rej(err);
        }
      })
    })
  }

  getTodoItems(todo: any) {
    this.isTodoItemsLoading = true;
    const token = this.getToken();
    this.selectedTodo['todoItems'] = [];
    this.http.get(this.baseURL + `/todos/getTodo?todoId=${todo['todoId']}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data: any) => {
        this.selectedTodo['todoId'] = todo['todoId'];
        this.selectedTodo['todoItems'] = data['result'];
        this.isTodoItemsLoading = false;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  updateTodos(todos: any) {
    const token = this.getToken();
    return new Promise((res, rej) => {
      this.http.put(this.baseURL + `/todos`, todos, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: (data: any) => {
          res(data);
        },
        error: err => {
          console.log(err)
          rej(err)
        }
      })
    })
  }

  deleteTodo(todo: any) {
    const token = this.getToken();
    return new Promise((res, rej) => {
      this.http.delete(this.baseURL + "/todos", {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
        body: todo,
      }).subscribe({
        next: data => {
          return res(data);
        },
        error: err => {
          return rej(err);
        }
      })
    })
  }

  getToken() {
    return localStorage.getItem('token');
  }

  resetSelectedTodo() {
    this.selectedTodo = {
      todoId: null,
      todoTitle: '',
      todoItems: []
    }
  }

  resetPagination() {
    this.totalPages = 0;
    this.pageNumbers = [];
    this.selectedPage = 1;
  }
}
