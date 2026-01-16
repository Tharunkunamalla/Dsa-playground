import mongoose from 'mongoose';

const CreativeEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String, // 'drawing' or 'note'
    enum: ['drawing', 'note'],
    required: true
  },
  content: {
    type: String, // Base64 for drawing, text for note
    required: true
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CreativeEntry = mongoose.models.CreativeEntry || mongoose.model('CreativeEntry', CreativeEntrySchema);
export default CreativeEntry;
