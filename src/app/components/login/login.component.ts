import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { getRouterLink, PageRouts } from '../../routing/pages';
import { faExclamationCircle, faRightToBracket, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router)
  
  protected readonly faExclamationCircle = faExclamationCircle;
  protected readonly faRightToBracket = faRightToBracket;
  protected readonly faUpRightFromSquare = faUpRightFromSquare;
  
  signUpFailed: boolean = false;
  logInFailed: boolean = false;
  
  logInForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    },
    {}
  );
  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    },
    this.sameFieldValues('password', 'repeatPassword')
  );
  
  logIn(): void {
    this.logInFailed = false;
    this.authService.logInUser(this.logInForm.value.email!, this.logInForm.value.password!)
      .then(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(getRouterLink(PageRouts.DASHBOARD)).then()
        } else {
          this.logInFailed = true;
        }
      })
  }
  
  signUp(): void {
    this.signUpFailed = false;
    this.authService.createUser(this.signUpForm.value.email!, this.signUpForm.value.password!)
      .then(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(getRouterLink(PageRouts.DASHBOARD)).then()
        } else {
          this.signUpFailed = true;
        }
      })
  }
  
  private sameFieldValues(firstControlName: string, secondControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const firstControl = formGroup.get(firstControlName);
      const secondControl = formGroup.get(secondControlName);
      
      if (!firstControl || !secondControl) {
        return null;
      }
      
      if (firstControl.value !== secondControl.value) {
        return {differentValues: true};
      }
      
      return null;
    };
  }
  
}
