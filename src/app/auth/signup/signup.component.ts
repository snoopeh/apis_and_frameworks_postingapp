import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService,private http: HttpClient){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm){
    let isValidEmail:string;
    let body: any;
    this.verifyEmail(form.value.email).subscribe(emailValidation => {
      console.log(emailValidation)
      isValidEmail = emailValidation.data.status
      body = emailValidation;
    });
    if(isValidEmail == "invalid" || isValidEmail == "disposable" || isValidEmail == "unknown"){
      console.log(body)
      return;
    }
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  verifyEmail(email: string){
    return this.http
      .get<{
        data:{
          status:string,
          result: string,
          _deprecation_notice: string,
          score: number,
          email: string,
          regexp: boolean,
          gibberish: boolean,
          disposable: boolean,
          webmail: boolean,
          mx_records: boolean,
          smtp_server: boolean,
          smtp_check: boolean,
          accept_all: boolean,
          sources: boolean
        },
        meta: any
      }>("https://api.hunter.io/v2/email-verifier?email=" + email + "&api_key=e4fd774a4d7cb0367e4b3ae8ac0bc15aa86011aa");
  }
}


