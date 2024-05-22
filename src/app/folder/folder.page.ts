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
  private activatedRoute = inject(ActivatedRoute);
  users: any;
  profiles: any;
  private apiUrl: string = 'http://127.0.0.1:8000/api/';
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
  public user = 'teste';

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    if (this.folder === 'administracao') {
      this.getProfiles()
      this.getUsers();
      
    }
  }

  getProfiles() {
    this.http.get(`${this.apiUrl}profile`, { responseType: 'text' }).subscribe(
      (res) => {
        let data = JSON.parse(res);
        this.profiles = data.dados;
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

  getUsers(){
    let dataGrid:any = [];
    let data = {
      profile_id: this.profile_id,
    };

    this.http
        .post(`${this.apiUrl}usersAll`, data, { responseType: 'text' })
        .subscribe(
          (res) => {
            let data = JSON.parse(res);
            data.dados.forEach((element: any) => {
              let profileData = this.profiles.find((res: any) => element.profile_id === res.id)
              dataGrid.push({
                ...element,
                "profile_name": profileData.name
              })
            });
            this.users = dataGrid;
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

  updateProfile() {}
}
