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
  private apiUrl: string = 'http://127.0.0.1:8000/api/';
  private erro = false
  private profile_id = sessionStorage.getItem('profile_id')
  constructor(
    public router: Router,
    public http: HttpClient
  ) {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    if(this.folder === "administracao"){

      let data = {
          "profile_id": this.profile_id
        }
      
      this.http.post(`${this.apiUrl}usersAll`,data, {responseType: 'text'}).subscribe(
      
        (res) => {
          console.log(JSON.parse(res))
          let data = JSON.parse(res)
          this.users = data.dados
          //this.router.navigate(['/folder/home']);
        },
        (err) => {
          this.erro = true
          console.log(err);
          if (err.status == 404) {
            
            console.log(err);
          }
        }
      )}
  }

  updateProfile(){

  }
}
