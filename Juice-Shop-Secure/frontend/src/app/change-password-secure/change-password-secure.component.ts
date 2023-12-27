/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type AbstractControl, UntypedFormControl, Validators } from '@angular/forms'
import { UserService } from '../Services/user.service'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { FormSubmitService } from '../Services/form-submit.service'
import { TranslateService } from '@ngx-translate/core'

library.add(faSave, faEdit)

@Component({
  selector: 'app-change-password-secure',
  templateUrl: './change-password-secure.component.html',
  styleUrls: ['./change-password-secure.component.scss']
})
export class ChangePasswordSecureComponent { 
  public newPasswordControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(40)])
  public repeatNewPasswordControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(40), matchValidator(this.newPasswordControl)])
  public error: any
  public confirmation: any
  private token: string

  constructor (private route: ActivatedRoute, private readonly userService: UserService, private readonly formSubmitService: FormSubmitService, private readonly translate: TranslateService) { }

  ngOnInit () {
    this.route.queryParams.subscribe(params => {
      this.token = params['token']; // Access the token from the URL
      // You can now use this.token as needed
    });
    this.formSubmitService.attachEnterKeyHandler('password-form', 'changeButton', () => { this.changePasswordSecure() })
  }

  changePasswordSecure () {
    this.userService.changePasswordSecure({
      token: this.token,
      new: this.newPasswordControl.value,
      repeat: this.repeatNewPasswordControl.value
    }).subscribe((response: any) => {
      this.error = undefined
      this.translate.get('PASSWORD_SUCCESSFULLY_CHANGED').subscribe((passwordSuccessfullyChanged) => {
        this.confirmation = passwordSuccessfullyChanged
      }, (translationId) => {
        this.confirmation = { error: translationId }
      })
      this.resetForm()
    }, (error) => {
      console.log(error)
      this.error = error
      this.confirmation = undefined
      this.resetPasswords()
    })
  }

  resetForm () {
    this.resetPasswords()
  }

  resetPasswords () {
    this.newPasswordControl.setValue('')
    this.newPasswordControl.markAsPristine()
    this.newPasswordControl.markAsUntouched()
    this.repeatNewPasswordControl.setValue('')
    this.repeatNewPasswordControl.markAsPristine()
    this.repeatNewPasswordControl.markAsUntouched()
  }
}

function matchValidator (newPasswordControl: AbstractControl) {
  return function matchOtherValidate (repeatNewPasswordControl: UntypedFormControl) {
    const password = newPasswordControl.value
    const passwordRepeat = repeatNewPasswordControl.value
    if (password !== passwordRepeat) {
      return { notSame: true }
    }
    return null
  }
}
