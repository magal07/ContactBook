const mongoose = require('mongoose');
// schema = modelagem dos dados
const HomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

class Home {

}

module.exports = Home;