import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode'
import { AuthService } from 'src/app/services/auth.service';
import { TodosService } from 'src/app/services/todos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {

  selectedTodoTitle = "";
  todoItems:any = []
  username = "";

  todoInput = "";

  constructor(public todos: TodosService, public auth: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token') || "";
    const decoded: any = jwt_decode(token);
    this.username = decoded['username'];
    this.todos.getTodos();
  }

  selectTodo(id: any) {
    this.todos.todoItemInput = "";
    const idx = this.todos.todos.findIndex((f: any) => f['todo_id'] == id);
    this.todos.selectedTodo.todoTitle = this.todos.todos[idx]['todo_title'];
    this.todos.getTodoItems({
      todoId: this.todos.todos[idx]['todo_id']
    })
  }

  async addTodo() {
    const todo = {
      todoTitle: this.todoInput,
      isTodoItem: false
    }

    try {
      const addResp: any = await this.todos.addTodo(todo);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: addResp['msg'],
        showConfirmButton: false,
        timer: 1500
      })
      this.todos.getTodos();
    }catch(err: any) {
      const errors: any = err['error']['error'];
      let errorMessages = "";
      for(const e of Object.keys(errors)) {
        errorMessages += `<p>${errors[e]['message']}</p><br/>`;
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: errorMessages
      })
    }

    this.todoInput = "";
  }

  deleteTodo(todoId: any) {
    const todo = {
      todoId,
      isTodoItem: false
    }

    try {
      Swal.fire({
        title: 'Do you want delete this todo? All todo sub items will be deleted.',
        showCancelButton: true,
        confirmButtonText: 'Delete',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.todos.deleteTodo(todo);
          this.todos.getTodos();
          this.todos.resetSelectedTodo();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Delete successful',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }catch(err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error deleting todo'
      })
    }
  }

  getPage(pageNum: any) {
    this.todos.selectedPage = pageNum;
    this.todos.getTodos();
  }

  nextPage() {
    if(this.todos.selectedPage < this.todos.totalPages) {
      this.todos.selectedPage++;
      this.todos.getTodos();
    }
  }

  prevPage() {
    if(this.todos.selectedPage > 1) {
      console.log("P")
      this.todos.selectedPage--;
      this.todos.getTodos();
    }
  }

  logout() {
    this.todos.resetPagination();
    Swal.fire({
      title: 'Do you want logout?',
      showCancelButton: true,
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
      }
    })
  }

}
