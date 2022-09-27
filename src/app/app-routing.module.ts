import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { TodosListComponent } from './components/todos-list/todos-list.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginRegisterComponent
  },
  {
    path: "",
    component: TodosListComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
