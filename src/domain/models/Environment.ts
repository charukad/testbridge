import mongoose, { Schema, Document } from 'mongoose';

export interface IEnvironment extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  appUrl?: string;
  apiBaseUrl?: string;
  username?: string;
  encryptedPassword?: string;
  browser?: string;
  device?: string;
  buildVersion?: string;
  releaseVersion?: string;
  instructions?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EnvironmentSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  appUrl: { type: String },
  apiBaseUrl: { type: String },
  username: { type: String },
  encryptedPassword: { type: String },
  browser: { type: String },
  device: { type: String },
  buildVersion: { type: String },
  releaseVersion: { type: String },
  instructions: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Environment || mongoose.model<IEnvironment>('Environment', EnvironmentSchema);
