import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  @Input() user?: User;
  @Output() formSubmit = new EventEmitter<User>();
  @Output() cancelForm = new EventEmitter<void>();

  userForm!: UntypedFormGroup;
  roleOptions = ['User', 'Manager', 'Admin'];
  formSubmitted = false;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      phone: ['', Validators.pattern(/^[0-9\-\+\s]*$/)],
      address: [''],
      joinDate: [new Date()]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value);
    }
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  // Helper methods for form validation and error messages
  get nameControl() { return this.userForm.get('name'); }
  get emailControl() { return this.userForm.get('email'); }
  get roleControl() { return this.userForm.get('role'); }
  get phoneControl() { return this.userForm.get('phone'); }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.dirty || control.touched || this.formSubmitted);
  }
}
