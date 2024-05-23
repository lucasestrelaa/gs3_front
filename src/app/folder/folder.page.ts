import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;

  public nomeUsuario: string = '';
  public emailUsuario: string = '';
  private activatedRoute = inject(ActivatedRoute);
  users: any;
  user = {
    id: 0,
    nome: '',
    email: '',
    profile_id: 0,
    profile_name: ''
  };
  profiles: any;
  url = window.location.hostname
  private apiUrl: string = this.url.includes('localhost') ? 'http://localhost:8000/api/' :
  'https://desafiogs3.addictiontech.com.br/public/api/';
  private erro = false;
  private profile_id = sessionStorage.getItem('profile_id');
  

  constructor(public router: Router, public http: HttpClient) {}

  public appPages = [
    { title: 'Home', url: '/folder/home', icon: 'home', permission: true },
    {
      title: 'Perfil',
      url: '/folder/perfil',
      icon: 'person',
      permission: true,
    },
    {
      title: 'Adm',
      url: '/folder/administracao',
      icon: 'build',
      permission: this.profile_id == '1' ? true : false,
    },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
      this.getProfiles();
  }

  getProfiles() {
    this.http.get(`${this.apiUrl}profile`, { responseType: 'text' }).subscribe(
      (res) => {
        let data = JSON.parse(res);
        this.profiles = data.dados;
        if (this.folder === 'administracao') {
          this.getUsers();
          this.getUser();
        }else{
          this.getUser();
        }
      },
      (err) => {
        this.erro = true;
        console.log(err);
        if (err.status == 404) {
          console.log(err);
        }
      }
    );
  }

  getUsers() {
    let dataGrid: any = [];
    let data = {
      profile_id: this.profile_id,
    };

    this.http
      .post(`${this.apiUrl}usersAll`, data, { responseType: 'text' })
      .subscribe(
        (res) => {
          let data = JSON.parse(res);
          if (this.profiles.length > 0) {
            data.dados.forEach((element: any) => {
              let profileData = this.profiles.find(
                (res: any) => element.profile_id === res.id
              );
              dataGrid.push({
                ...element,
                profile_name: profileData.name,
              });
            });
            this.users = dataGrid;
          }
        },
        (err) => {
          this.erro = true;
          console.log(err);
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
  }
  getUser() {
    let dataGrid: any = [];
    let user_id = sessionStorage.getItem('user_id')
    let token = sessionStorage.getItem('token')

    this.http
      .get(`${this.apiUrl}user/${token}/${user_id}`)
      .subscribe(
        (res) => {
          let data = res;
          const array = Object.entries(res).map(([chave, valor]) => valor);
          let profileData = this.profiles.find(
            (res: any) => array[1].profile_id === res.id
          );
          this.user = {
            ...array[1],
            profile_name: profileData.name
          }
        },
        (err) => {
          this.erro = true;
          console.log(err);
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
  }

  updateProfile() {
    console.log(this.nomeUsuario + " - "+ this.emailUsuario)
    //se não tiver valor - não mudou enão não faz nada
    //se o valor for igual ao original, não fazer nada
    //diferente, atualiza usuário e redireciona para folder/perfil
    if(
      (this.nomeUsuario == '' || this.emailUsuario == '') ||
      (this.nomeUsuario == this.user.nome ||  this.emailUsuario == this.user.email)
    ){
      
    }
  }
  updateProfileUser(event: any) {
    console.log('update Profile User:' + event);
    //se não tiver valor - não mudou enão não faz nada
    //se o valor for igual ao original, não fazer nada
    //diferente, atualiza usuário e redireciona para folder/administrador
  }
}
