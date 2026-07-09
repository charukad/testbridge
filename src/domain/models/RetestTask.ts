import mongoose, { Schema, Document } from 'mongoose';

export interface IRetestTask extends Document {
  projectId: mongoose.Types.ObjectId;
  issueId: mongoose.Types.ObjectId;
  testRunId: mongoose.Types.ObjectId;
  testCaseId: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  status: 'Pending' | 'In Progress' | 'Passed' | 'Failed Again' | 'Closed';
  testerNote?: string;
  result?: string;
  screenshots?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RetestTaskSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
  testRunId: { type: Schema.Types.ObjectId, ref: 'TestRun', required: true },
  testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Passed', 'Failed Again', 'Closed'], default: 'Pending' },
  testerNote: { type: String },
  result: { type: String },
  screenshots: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.RetestTask || mongoose.model<IRetestTask>('RetestTask', RetestTaskSchema);
