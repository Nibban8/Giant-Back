import mongoose from 'mongoose';

const partchema = mongoose.Schema({
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

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
