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
  private apiUrl: string = 'http://127.0.0.1:8000/api/';
  constructor(private router: Router, public http: HttpClient) {}

  ngOnInit() {}
  autenticacao = false;
  login() {
    alert('Teste email: ' + this.email + ' senha: ' + this.password);
    var usuario = { login: this.email, password: this.password };
    this.http.post(`${this.apiUrl}login`, usuario).subscribe(
      
      (res) => {
        console.log("logou")
        const array = Object.entries(res).map(([chave, valor]) => valor);
        console.log(array[2]); 

        sessionStorage.setItem('token', array[2])
        this.router.navigate(['/folder/home']);
      },
      (erro) => {
        if (erro.status == 404) {
          console.log(erro);
        }
      }
    );
  }
  cadastrar() {

  }
  logout() {

  }
}
