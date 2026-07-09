import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  projectId: mongoose.Types.ObjectId;
  issueId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  attachments: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
