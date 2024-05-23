import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public profile_id = sessionStorage.getItem('profile_id')
  public appPages = [
    { title: 'Home', url: '/folder/home', icon: 'home', permission: true },
    { title: 'Perfil', url: '/folder/perfil', icon: 'person', permission: true },
    { title: 'Adm', url: '/folder/administracao', icon: 'build', permission: this.profile_id == '1' ? true : false },
  ];
  
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public user = "teste"
  constructor(public router: Router) {
  }
}
