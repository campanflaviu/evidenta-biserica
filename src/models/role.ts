import mongoose from 'mongoose';

export interface Role {
  name: String
}

// available roles should be: admin, user, member
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Role', roleSchema);
