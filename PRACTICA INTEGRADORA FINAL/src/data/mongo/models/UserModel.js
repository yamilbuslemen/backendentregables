import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  age: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'premium'],
    default: 'user',
    required: true 
  },
  cartId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
    required: false  // In case cart creation fails
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chats',
    required: false
  },
  documents: {
    type: [{
      name: {
        type: String,
        required: true
      },
      reference: {
        type: String,
        required: true
      },
    }],
    default: []
  },
  last_connection: {
    type: Date,
    required: false
  }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;