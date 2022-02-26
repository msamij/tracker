// This class deals with the authentication view logic.
export class AuthView {
  inputFields = document.querySelectorAll('input');
  form: HTMLFormElement = document.querySelector('.form');
  errorNode: HTMLDivElement = document.querySelector('.message');
  submitButton: HTMLButtonElement = document.querySelector('.btn-primary');
  linkButton: HTMLButtonElement = document.querySelector('.btn-secondary');

  constructor(submitForm: Function) {
    this.resetInputFields();
    this.form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitForm();
    });
  }

  url(): string {
    return this.submitButton.dataset.url;
  }
  username(): string {
    return this.inputFields[1].value;
  }
  password(): string {
    return this.inputFields[2].value;
  }
  confirmPassword(): string {
    if (!this.inputFields[3]) return;
    return this.inputFields[3].value;
  }

  toggleButtonClick(clickable: boolean): void {
    this.submitButton.disabled = clickable;
    this.linkButton.disabled = clickable;
  }

  // Changes input fields UI default by django.
  private resetInputFields(): void {
    Array.from(this.inputFields).forEach(function (field) {
      field.classList.add('form__input');
    });

    this.inputFields[1].placeholder = 'username';
    this.inputFields[1].classList.add('form__input--username');
    this.inputFields[2].placeholder = 'password';
    this.inputFields[2].classList.add('form__input--password1');

    // Checks only for login page, since there won't be any confirm password field.
    if (!this.inputFields[3]) return;
    this.inputFields[3].placeholder = 'confirm password';
    this.inputFields[3].classList.add('form__input--password2');
  }
}
