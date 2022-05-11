import mongoose from 'mongoose';

// available roles should be: admin, user, member
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
