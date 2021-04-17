import mongoose from 'mongoose';

const partSchema = mongoose.Schema({
  nombre: String,
  marca: String,
  tipo: String,
  creator: String,
  selectedFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const BuildPart = mongoose.model('BuildPart', partSchema);

export default BuildPart;
