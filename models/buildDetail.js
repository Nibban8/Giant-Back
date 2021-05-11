import mongoose from 'mongoose';

const buildSchema = mongoose.Schema({
  client_name: { type: String, required: true },
  client_address: { type: String, required: true },
  client_phone: { type: String, required: true },
  parts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuildPart' }],
  },
});

const Build = mongoose.model('Build', buildSchema);

export default Build;
