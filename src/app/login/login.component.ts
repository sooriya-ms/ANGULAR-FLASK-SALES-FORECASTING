import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginResponse {
  auth: any;
  success: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private _snackBar: MatSnackBar) { }

  username: string = "";
  email: string = "";
  password: string = "";
  reenterpass: string = "";
  hide: boolean = true;
  show: boolean = false;
  signup: boolean = false;
  message: string = "";
  color: string = "mat-warn";
  duration: number = 2 * 1000;


  ngOnInit(): void {

  }

  openSnackBar() {
    this._snackBar.open(this.message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: this.duration,
      panelClass: ['mat-toolbar', this.color],
    });
  }

  isEmail(email: string): boolean {
    var email_tf: boolean = false;
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email_tf = regexp.test(email)
    return email_tf;
  }

  validate(type: string) {
    if (type == 'login') {
      if (this.email == '') {
        this.message = "Email is empty🥲";
        this.duration = 3 * 1000;
        this.openSnackBar();
        return false;
      }
      else {
        if (this.password == '') {
          this.message = "Password is empty🥲";
          this.duration = 3 * 1000;
          this.openSnackBar();
          return false;
        }
      }
    }
    else {
      if (type == 'signup') {
        if (this.username == '') {
          this.message = "Username is empty🥲";
          this.duration = 3 * 1000;
          this.openSnackBar();
          return false;
        }
        else {
          if (this.email == '') {
            this.message = "Email is empty🥲";
            this.duration = 3 * 1000;
            this.openSnackBar();
            return false;
          }
          else {
            if (this.password == '') {
              this.message = "Password is empty🥲";
              this.duration = 3 * 1000;
              this.openSnackBar();
              return false;
            }
            else {
              if (this.reenterpass == '') {
                this.message = "Fill the Reenter Password field🥲";
                this.duration = 3 * 1000;
                this.openSnackBar();
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  openSignUp() {
    this.signup = !this.signup;
    console.log(this.signup)
  }

  signUp() {
    if (!this.isEmail(this.email)) {
      this.message = "Enter a valid Email";
      this.openSnackBar();
    } else {
      if (this.validate("signup")) {
        if (this.password == this.reenterpass) {
          this.http.post<LoginResponse>('http://127.0.0.1:5000/user', { username: this.username, email: this.email, password: this.password }).subscribe((data) => {
            console.log(data.auth.success)
            if (data.auth.success == false) {
              this.message = "Email already exists\nTry new ONE⚡"
              this.openSnackBar()
            }
            else {
              if (data.auth.success == true) {
                console.log("gotolog")
                this.openSignUp()
              }
            }
          })
        }
        else {
          this.message = "Password fields must be same⚡"
          this.openSnackBar()
        }
      }
    }
  }

  logIn() {
    if (!this.isEmail(this.email)) {
      this.message = "Enter a valid Email";
      this.openSnackBar();
    } else {
      if (this.validate("login")) {
        this.http.post<LoginResponse>('http://127.0.0.1:5000/auth_user', { email: this.email, password: this.password }).subscribe((data: LoginResponse) => {
          console.log(data.auth.success);
          if (data.auth.success == true) {
            this.gotodash();
          }
          else {
            this.message = "Invalid Login🥲"
            this.openSnackBar()
            this.clear();
          }
        }, error => {
          console.log(error);
          this.clear();
        });
      }
    }
  }
  clear() {
    this.email = "";
    this.password = "";
    this.show = false;
    console.log(this.hide)
  }
  gotodash() {
    this.router.navigate(["dashboard"]);
    this.show = true;
  }
}
