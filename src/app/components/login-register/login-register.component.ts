import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  inputsData = {
    username: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.inputsData).subscribe({
      next: data => {
        this.resetInput();
        localStorage.setItem('token', data['token']);
        this.router.navigate(['']);
      },
      error: err => {
        this.resetInput();
        this.displayError(err);
      }
    })
  }

  register() {
    this.auth.register(this.inputsData).subscribe({
      next: data => {
        this.resetInput();
        alert('Register success')
      },
      error: err => {
        this.resetInput();
        this.displayError(err)
      }
    })
  }

  displayError(err: any) {
    if(err['error']['error']) {
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
    } else if (err['error']['msg']) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: `<p>${err['error']['msg']}</p>`
      })
    }
  }

  resetInput() {
    this.inputsData = {
      username: '',
      password: ''
    }
  }

}
