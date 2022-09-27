import { Component, Input, OnInit } from '@angular/core';
import { TodosService } from 'src/app/services/todos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss']
})
export class TodoDetailsComponent implements OnInit {
  @Input() todoTitle = "";

  todoInput = "";
  isEditing = false;
  itemChanges: any = [];

  constructor(public todos: TodosService) { }

  ngOnInit(): void {
  }

  async addTodo() {
    const todo = {
      todoId: this.todos.selectedTodo.todoId,
      todoItemTitle: this.todos.todoItemInput,
      isTodoItem: true
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
      this.todos.getTodoItems({
        todoId: this.todos.selectedTodo.todoId
      });
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

    this.todos.todoItemInput = "";
  }

  async editOrSave() {
    if(this.isEditing) {
      Swal.fire({
        title: 'Do you want save your changes?',
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.todos.updateTodos({
              todos: this.itemChanges
            });
            this.todos.getTodoItems({
              todoId: this.todos.selectedTodo.todoId
            });
            this.itemChanges = [];
          }catch (err) {
          }
        }
      })
    }
    this.isEditing = !this.isEditing;
  }

  checkChange(e: any, todoItemId: any, isDone: any) {
    const idx = this.itemChanges.findIndex((f: any) => f['todoItemId'] == todoItemId);
    if(idx >= 0) {
      this.itemChanges[idx]['isDone'] = isDone;
    } else {
      this.itemChanges.push({
        todoItemId, isDone
      })
    }
  }

  deleteTodo(todoItemId: any) {
    const todo = {
      todoItemId,
      isTodoItem: true
    }

    try {
      Swal.fire({
        title: 'Do you want delete this todo item?',
        showCancelButton: true,
        confirmButtonText: 'Delete',
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.todos.isTodoItemsLoading = true;
          await this.todos.deleteTodo(todo);
          this.todos.getTodoItems({
            todoId: this.todos.selectedTodo['todoId']
          });
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

  cancelEdit() {
    this.isEditing = false;
  }

}
