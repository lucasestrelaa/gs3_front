import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string = '';
  public password: string = '';
  url = window.location.hostname
  private apiUrl: string = this.url.includes('localhost') ? 'http://localhost:8000/api/' :
  'https://desafiogs3.addictiontech.com.br/public/api/'

  constructor(private router: Router, public http: HttpClient) {}

  ngOnInit() {
    console.log(this.url)
    console.log(this.apiUrl);
    
  }
  autenticacao = false;
  erro = false
  login() {
    var usuario = { login: this.email, password: this.password };
    this.http.post(`${this.apiUrl}login`, usuario).subscribe(
      
      (res) => {
        console.log("logou")
        const array = Object.entries(res).map(([chave, valor]) => valor);
        console.log(array); 

        sessionStorage.setItem('profile_id', array[2])
        sessionStorage.setItem('token', array[3])
        sessionStorage.setItem('user_id', array[4])
        this.router.navigate(['/folder/home']);
      },
      (err) => {
        this.erro = true
        if (err.status == 404) {
          
          console.log(err);
        }
      }
    );
  }
  cadastrar() {

  }
  logout() {

  }
}
