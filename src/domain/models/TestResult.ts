import mongoose, { Schema, Document } from 'mongoose';

export interface ITestResult extends Document {
  testRunId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  testCaseId: mongoose.Types.ObjectId;
  testerId: mongoose.Types.ObjectId;
  result: 'Pass' | 'Fail' | 'Blocked' | 'Not Tested';
  actualResult?: string;
  note?: string;
  screenshots?: string[];
  severity?: string;
  developerReply?: string;
  retestStatus?: string;
  issueId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema: Schema = new Schema({
  testRunId: { type: Schema.Types.ObjectId, ref: 'TestRun', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase', required: true },
  testerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  result: { type: String, enum: ['Pass', 'Fail', 'Blocked', 'Not Tested'], required: true },
  actualResult: { type: String },
  note: { type: String },
  screenshots: [{ type: String }],
  severity: { type: String },
  developerReply: { type: String },
  retestStatus: { type: String },
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue' },
}, { timestamps: true });

export default mongoose.models.TestResult || mongoose.model<ITestResult>('TestResult', TestResultSchema);
