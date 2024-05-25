import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;

  public name: string = ''
  public emailUser: string = ''
  public descriptionProfile: string = ''
  public passwordUser: string = ''
  private activatedRoute = inject(ActivatedRoute)
  users: any;
  user = {
    id: 0,
    name: '',
    email: '',
    profile_id: 0,
    profile_name: ''
  };
  profile = {
    id: 0,
    name: '',
    description: ''
  };
  profiles: any;
  data: any;
  url = window.location.hostname
  private apiUrl: string = this.url.includes('localhost') ? 'http://localhost:8000/api/' :
  'https://desafiogs3.addictiontech.com.br/public/api/'
  titlePage = ''
  private profile_id = sessionStorage.getItem('profile_id')
  user_id = sessionStorage.getItem('user_id')
  token = sessionStorage.getItem('token')

  constructor(
    public router: Router, 
    public http: HttpClient,
    private loadingCtrl: LoadingController
    ) {
      
    }

  public appPages = [
    { title: 'Home', url: '/folder/home', icon: 'home', permission: true },
    {
      title: 'Perfil',
      url: '/folder/profileUser',
      icon: 'person',
      permission: true,
    },
    {
      title: 'Adm',
      url: '/folder/administracao',
      icon: 'build',
      permission: this.profile_id == '1' ? true : false,
    },
    {
      title: 'Novo Usuario',
      url: '/folder/newUser',
      icon: 'build',
      permission: false,
    },
    {
      title: 'Perfis',
      url: '/folder/profiles',
      icon: 'people',
      permission: this.profile_id == '1' ? true : false,
    },
    {
      title: 'Perfis',
      url: '/folder/profile/:id',
      icon: 'build',
      permission: false,
    },
    {
      title: 'Novo Perfil',
      url: '/folder/newProfile',
      icon: 'build',
      permission: false,
    },
    
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    var numsStr = this.folder.replace(/[^0-9]/g,'') ? parseInt(this.folder.replace(/[^0-9]/g,'')) : '';
    this.appPages.map((res: any) => {if(res.url.includes(this.folder)){ this.titlePage = res.title }})
    if(numsStr != ''){
      this.getProfile(this.folder)
      let routerPart = this.router.url.split('/')
      this.folder = routerPart[routerPart.length - 2]
    }else{
      
      this.getProfiles();
    }
    
      /*
        implementação futura - 
        pegar hora do session e comparar com a hora atual, 
        se for maior que 15 minutos, buscar token na api, 
        comparar horas e deslogar 
      */
  }
  submit(){
    //rota = perfil
    if(this.router.url === '/folder/perfil'){
      this.updateUser()
    }else if(this.router.url === '/folder/newUser'){
      //rota = newUser
      if(
        this.name == "" || 
        this.emailUser == "" ||
        this.passwordUser == ""
      ){
        this.showLoading("Confira os campos e tente novamente!")
      }else{
        this.newUser()
      }
    }else if(this.router.url.includes('/folder/profileUser')){
      this.updateUser()
    }
    else if(this.router.url.includes('/folder/newProfile')){
      if(
        this.name == "" || 
        this.descriptionProfile == ""
      ){
        this.showLoading("Confira os campos e tente novamente!")
      }else{
        this.newProfile()
      }
    }else if(this.router.url.includes('/folder/profile/')){
      this.updateProfile()
    }
  }
  logout(){
    let data = {
      token: this.token
    }
    this.http.post(`${this.apiUrl}logout`, data).subscribe(
      (res) => {
        const array = Object.entries(res).map(([chave, valor]) => valor);
        this.showLoading(array[1])
        sessionStorage.clear()
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 4000);
      },
      (err) => {
        
        if (err.status == 404) {
          console.log(err);
        }
      }
    );
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
        ;
        if (err.status == 404) {
          console.log(err);
        }
      }
    );
  }
  getProfile(profile_select_id: any){
    // como já possui o array de serviços, vou buscar aqui, sem precisar fazer requisição
    this.http
      .get(`${this.apiUrl}profile/${this.token}/${profile_select_id}`)
      .subscribe(
        (res) => {
          const array = Object.entries(res).map(([chave, valor]) => valor);
          this.profile = array[1]
        },
        (err) => {
          ;
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
  }
  newProfile(){
    let data = {
      token: this.token,
      user_id: this.user_id,
      profile_id: this.profile_id,
      name: this.name,
      description: this.descriptionProfile,
    }
    this.http.post(`${this.apiUrl}profile`, data).subscribe(
      (res) => {
        const array = Object.entries(res).map(([chave, valor]) => valor);
        this.showLoading(array[1])
        this.getProfiles()
        setTimeout(() => {
          this.router.navigate(['/folder/home']);
        }, 4000);
      },
      (err) => {
        
        this.showLoading(err.error)
        if (err.status == 404) {
          console.log(err);
        }
      }
    );
  }
  updateProfile(){
    let update = false;
    if(this.name == ''){
      this.name = this.profile.name
    }else{
      update = true
    }

    if(this.descriptionProfile == ''){
      this.descriptionProfile = this.profile.description
    }else{
      update = true
    }
    
    if(update){
      let data = {
        profile_id: this.profile.id,
        name: this.name,
        description: this.descriptionProfile,
      }
      this.http.put(`${this.apiUrl}profile`, data).subscribe(
        (res) => {
          const array = Object.entries(res).map(([chave, valor]) => valor);
          this.showLoading(array[1])
          setTimeout(() => {
            this.router.navigate(['/folder/profiles']);
          }, 4000);
        },
        (err) => {
          
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
    }else{
      let message = 'Não foram realizadas mudanças!'
      this.showLoading(message)
    }
  }
  deleteProfile(id: any){
    this.http
      .delete(`${this.apiUrl}profile/${this.profile_id}/${id}`)
      .subscribe(
        async (res) => {
          let data = res;
          const array = Object.entries(res).map(([chave, valor]) => valor);
          await this.showLoading(array[1])
        },
        async (err) => {
          ;
          await this.showLoading(err.error.message)
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
          ;
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
  }
  getUser() {
    let dataGrid: any = [];

    this.http
      .get(`${this.apiUrl}user/${this.token}/${this.user_id}`)
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
          ;
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
  }
  newUser(){
    let data = {
      token: this.token,
      user_id: this.user_id,
      profile_id: this.profile_id,
      name: this.name,
      email: this.emailUser,
      password: this.passwordUser
    }
    this.http.post(`${this.apiUrl}users`, data).subscribe(
      (res) => {
        const array = Object.entries(res).map(([chave, valor]) => valor);
        this.showLoading(array[1])
        this.getProfiles()
        setTimeout(() => {
          this.router.navigate(['/folder/administracao']);
        }, 4000);
      },
      (err) => {
        
        this.showLoading(err.error)
        if (err.status == 404) {
          console.log(err);
        }
      }
    );
  }
  updateUser() {
    let update = false;
    if(this.name == ''){
      this.name = this.user.name
    }else{
      update = true
    }

    if(this.emailUser == ''){
      this.emailUser = this.user.email
    }else{
      update = true
    }
    
    if(update){
      let data = {
        token: this.token,
        user_id: this.user_id,
        profile_id: this.profile_id,
        name: this.name,
        email: this.emailUser,
      }
      this.http.put(`${this.apiUrl}users`, data).subscribe(
        (res) => {
          const array = Object.entries(res).map(([chave, valor]) => valor);
          this.showLoading(array[1])
          this.getProfiles()
          setTimeout(() => {
            this.router.navigate(['/folder/administracao']);
          }, 4000);
        },
        (err) => {
          
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
    }else{
      let message = 'Não foram realizadas mudanças!'
      this.showLoading(message)
    }
  }
  updateProfileUser(id: any, event: any) {
    let data = {
      profile_id: this.profile_id,
      token: this.token,
      user_id: id,
      profile_id_new: event
    }
    this.http.put(`${this.apiUrl}updateProfileUser`, data).subscribe(
      (res) => {
        const array = Object.entries(res).map(([chave, valor]) => valor);
        this.showLoading(array[1])
        this.getProfiles()
      },
      (err) => {
        
        if (err.status == 404) {
          console.log(err);
        }
      }
    );
  }
  deleteUser(id: any){
    this.http
      .delete(`${this.apiUrl}users/${this.profile_id}/${id}`)
      .subscribe(
        async (res) => {
          let data = res;
          const array = Object.entries(res).map(([chave, valor]) => valor);
          await this.showLoading(array[1])
        },
        async (err) => {
          ;
          await this.showLoading(err.error.message)
          if (err.status == 404) {
            console.log(err);
          }
        }
      );
  }
  async showLoading(message: any) {
    const loading = await this.loadingCtrl.create({
      message: message,
      duration: 4000,
    });

    loading.present();
  }

  
}
