import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

registerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const registerUser = mongoose.model('user', registerSchema);
export default registerUser;
