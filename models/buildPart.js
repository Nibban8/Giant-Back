import mongoose from 'mongoose';

const partSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  interfaz: String,
  descripcion: String,
  selectedFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const BuildPart = mongoose.model('BuildPart', partSchema);

export default BuildPart;
