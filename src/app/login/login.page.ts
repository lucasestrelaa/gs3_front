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
  private apiUrl: string = 'http://localhost:3001';
  constructor(
    private router: Router,
    public http: HttpClient
  ) {
    
  }

  ngOnInit() {}
  autenticacao = false;
  login() {
    alert('Teste email: ' + this.email + ' senha: ' + this.password);
    var usuario = { email: this.email, password: this.password };
    //this.http.post(`${this.apiUrl}/usuario`, usuario).subscribe(
      //(res) => {
        this.router.navigate(['/folder/home'])
      //},
      //(erro) => {
      //  if (erro.status == 400) {
     //     console.log(erro);
     //   }
      //}
   // );
  }
  cadastrar() {}
  logout() {}
}
