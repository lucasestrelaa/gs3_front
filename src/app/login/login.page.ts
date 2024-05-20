import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // public formLogin: FormGroup;
  public email: string = '';
  public password: string = '';
  constructor(
    // private formBuilder: FormBuilder

  ) { 
    // this.formLogin = this.formBuilder.group({
		// 	'email': [null, Validators.compose([Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
		// 	'password': [null, Validators.compose([Validators.required, Validators.minLength(3)])]
		// });
  }

  ngOnInit() {
  }
  autenticacao = false
  login() {
    alert("Teste email: "+this.email+" senha: "+this.password)
  }
  cadastrar(){

  }
  logout(){

  }

}
