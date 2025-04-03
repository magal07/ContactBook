const mongoose = require("mongoose");
const validator = require("validator");
// schema = modelagem dos dados
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telephone: { type: String, required: false, default: "" },
  createIn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = async function () {
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.validate = function () {
  this.cleanUp();
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("Invalid email");
  if (!this.body.name) this.errors.push(`Name field is required.`);
  if (!this.body.email && !this.body.telephone)
    this.errors.push(`Please provide at least one form of contact.`);
};

Contact.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  this.body = {
    name: this.body.name,
    surname: this.body.surname,
    email: this.body.email,
    telephone: this.body.telephone,
  };
};

Contact.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.validate();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Static methods

Contact.searchById = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.searchContact = async function () {
  const contacts = await ContactModel.find().sort({ createIn: -1 });
  return contacts;
};

Contact.delete = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findOneAndDelete({ _id: id });
    return contact;
};

module.exports = Contact;
