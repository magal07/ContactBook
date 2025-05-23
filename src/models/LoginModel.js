const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

// schema = modelagem dos dados
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  // instance class login in LoginController
  constructor(body) { 
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login(){ 
    this.validate();
    if(this.errors.length > 0) return; 
    this.user = await LoginModel.findOne({ email: this.body.email}); // compare email
    if(!this.user){
       this.errors.push('User does not exist');
       return;
    }
    if(!bcryptjs.compareSync(this.body.password, this.user.password)) { // compare password hash
      this.errors.push('Invalid password.')
      return;
    }
  }
  
  async register() {
    this.validate();
    if(this.errors.length > 0) return; // check if the error array is empty 
    
    await this.userExists();
    if(this.errors.length > 0) return; 
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
}

async userExists() {
   this.user = await LoginModel.findOne({ email: this.body.email});
  if(this.user) this.errors.push('User already exists.');
}

  validate() {
    this.cleanUp();
    if(!validator.isEmail(this.body.email)) this.errors.push('Invalid email');
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('Password must be between 3 and 50 characters long.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      email: this.body.email, 
      password: this.body.password
    };
  }
}

module.exports = Login;