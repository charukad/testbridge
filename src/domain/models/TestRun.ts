import mongoose, { Schema, Document } from 'mongoose';

export interface ITestRun extends Document {
  projectId: mongoose.Types.ObjectId;
  environmentId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  assignedBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  testCaseIds: mongoose.Types.ObjectId[];
  status: string;
  deadline?: Date;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestRunSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  environmentId: { type: Schema.Types.ObjectId, ref: 'Environment', required: true },
  name: { type: String, required: true },
  description: { type: String },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testCaseIds: [{ type: Schema.Types.ObjectId, ref: 'TestCase' }],
  status: { type: String, default: 'Pending' },
  deadline: { type: Date },
  instructions: { type: String },
}, { timestamps: true });

export default mongoose.models.TestRun || mongoose.model<ITestRun>('TestRun', TestRunSchema);
