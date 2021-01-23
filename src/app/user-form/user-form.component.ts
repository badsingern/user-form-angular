import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export enum EmailErrorType {
  required = 'required',
  email = 'email',
  isExist = 'isExist'
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  readonly EmailErrorType = EmailErrorType;

  friends = this.fb.array([this.friendFormGroup()]);

  userForm = this.fb.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, this.isEmailExistValidator()]],
    password: [null, Validators.required],
    passwordRepeat: [null, [Validators.required, this.isPasswordExistValidator()]],
    friends: this.friends
  });

  constructor(private fb: FormBuilder) { }

  friendFormGroup(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
      friendsEmail: [null, [Validators.required, Validators.email]]
    });
  }

  addFriend(): void {
    this.friends.push(this.friendFormGroup());
  }

  isEmailControlHasError(errorType: EmailErrorType): boolean {
    return this.userForm.get('email').hasError(errorType);
  }

  isFriendsEmailHasError(i: number, errorType: EmailErrorType): boolean {
    return this.friends.controls[i].get('friendsEmail').hasError(errorType);
  }

  isNameControlHasError(i: number): boolean {
    return this.friends.controls[i].get('name').hasError('required');
  }

  isEmailExistValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      if (control.value !== null && control.value === 'testas@testas.lt') {
        return {[EmailErrorType.isExist]: true};
      }
      return null;
    };
  }

  isPasswordExistValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!this.userForm) {
        return null;
      }

      const passwordValue = this.userForm.get('password').value;
      if (control.value !== passwordValue) {
        return {notMatch: true};
      }
      return null;
    };
  }
}
