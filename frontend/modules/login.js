import validator from 'validator';

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit(e);
      this.validate(e);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('Formulário enviado!');
    const validField = this.isValid();
  }

  isValid() {
    let valid = true;

    for (let field of this.form.querySelectorAll('.form-login, .form-register')) {
      console.log(field);
    }

    return valid;
  }

  validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector('input[name="password"]');
    let error = false;

    this.clearErrors(el); 

    if (!validator.isEmail(emailInput.value)) {
      this.showError(emailInput, 'Invalid email');
      error = true;
    }

    if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      this.showError(passwordInput, 'Password must be between 3 and 50 characters long.');
      error = true;
    }

    if (!error) {
      console.log('Formulário válido!');
      el.submit();
    }
  }

  showError(input, message) {
    const errorSpan = document.createElement('span');
    errorSpan.classList.add('error-message', 'text-danger'); 
    errorSpan.textContent = message;
    input.parentNode.appendChild(errorSpan);
  }

  clearErrors(form) {
    form.querySelectorAll('.error-message').forEach(error => error.remove());
  }
}