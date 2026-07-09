import mongoose, { Schema, Document } from 'mongoose';

export interface ITestCase extends Document {
  projectId: mongoose.Types.ObjectId;
  testCaseId: string;
  module?: string;
  title: string;
  description?: string;
  preconditions?: string;
  steps: string;
  expectedResult: string;
  priority?: string;
  type?: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  testCaseId: { type: String, required: true },
  module: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  preconditions: { type: String },
  steps: { type: String, required: true },
  expectedResult: { type: String, required: true },
  priority: { type: String },
  type: { type: String },
  status: { type: String, default: 'Active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.TestCase || mongoose.model<ITestCase>('TestCase', TestCaseSchema);
