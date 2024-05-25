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
  }
  autenticacao = false;
  erro = false
  login() {
    var usuario = { login: this.email, password: this.password };
    this.http.post(`${this.apiUrl}login`, usuario).subscribe(
      
      (res) => {
        const array = Object.entries(res).map(([chave, valor]) => valor);
        var data = new Date(),
        minutos = 3;
        data.setMinutes(data.getMinutes() + minutos);
        sessionStorage.setItem('profile_id', array[2])
        sessionStorage.setItem('token', array[3])
        sessionStorage.setItem('user_id', array[4])
        sessionStorage.setItem('login_realizado', data.toString())
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
}
