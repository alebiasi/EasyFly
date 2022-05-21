const mongoose = require("mongoose");

//definisco lo schema per gli utenti
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  //aggiunta gestione admin
  admin: {
    type: Boolean,
    default: false
  }
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);