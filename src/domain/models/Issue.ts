import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue extends Document {
  projectId: mongoose.Types.ObjectId;
  testRunId: mongoose.Types.ObjectId;
  testCaseId: mongoose.Types.ObjectId;
  testResultId: mongoose.Types.ObjectId;
  issueNumber: number;
  title: string;
  description?: string;
  expectedResult?: string;
  actualResult?: string;
  screenshots?: string[];
  severity?: string;
  status: 'Open' | 'In Progress' | 'Fixed' | 'Retest Required' | 'Retesting' | 'Closed' | 'Reopened' | 'Rejected';
  reportedBy: mongoose.Types.ObjectId;
  assignedDeveloper?: mongoose.Types.ObjectId;
  developerNote?: string;
  fixNote?: string;
  retestCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  testRunId: { type: Schema.Types.ObjectId, ref: 'TestRun', required: true },
  testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase', required: true },
  testResultId: { type: Schema.Types.ObjectId, ref: 'TestResult', required: true },
  issueNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  expectedResult: { type: String },
  actualResult: { type: String },
  screenshots: [{ type: String }],
  severity: { type: String },
  status: { type: String, enum: ['Open', 'In Progress', 'Fixed', 'Retest Required', 'Retesting', 'Closed', 'Reopened', 'Rejected'], default: 'Open' },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDeveloper: { type: Schema.Types.ObjectId, ref: 'User' },
  developerNote: { type: String },
  fixNote: { type: String },
  retestCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);
