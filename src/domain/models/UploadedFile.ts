import mongoose, { Schema, Document } from 'mongoose';

export interface IUploadedFile extends Document {
  projectId: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: mongoose.Types.ObjectId;
  parsedStatus?: string;
  createdAt: Date;
}

const UploadedFileSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parsedStatus: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.models.UploadedFile || mongoose.model<IUploadedFile>('UploadedFile', UploadedFileSchema);
