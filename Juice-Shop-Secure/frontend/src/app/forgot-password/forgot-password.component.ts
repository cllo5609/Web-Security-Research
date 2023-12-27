/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { UserService } from '../Services/user.service'
import { SecurityQuestionService } from '../Services/security-question.service'
import { type AbstractControl, UntypedFormControl, Validators } from '@angular/forms'
import { Component } from '@angular/core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { type SecurityQuestion } from '../Models/securityQuestion.model'
import { TranslateService } from '@ngx-translate/core'

library.add(faSave, faEdit)

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public emailControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.email])
  public error?: string
  public confirmation?: string

  constructor (private readonly userService: UserService, private readonly translate: TranslateService) { }

  resetPassword() {
    if (this.emailControl.valid) {
      this.userService.resetPassword(this.emailControl.value).subscribe(() => {
        this.error = undefined;
        this.confirmation = 'If your email is registered, you will receive a password reset link.';
        this.resetForm();
      }, (error) => {
        this.error = error.error;
        this.confirmation = undefined;
        this.resetErrorForm();
      });
    }
  }

  resetForm () {
    this.emailControl.setValue('')
    this.emailControl.markAsPristine()
    this.emailControl.markAsUntouched()
  }

  resetErrorForm () {
    this.emailControl.markAsPristine()
    this.emailControl.markAsUntouched()
  }
}

function matchValidator (passwordControl: AbstractControl) {
  return function matchOtherValidate (repeatPasswordControl: UntypedFormControl) {
    const password = passwordControl.value
    const passwordRepeat = repeatPasswordControl.value
    if (password !== passwordRepeat) {
      return { notSame: true }
    }
    return null
  }
}
