#!/bin/bash
mkdir -p src/domain/models
mkdir -p src/lib

cat << 'EOF' > src/lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
EOF

cat << 'EOF' > src/domain/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Developer' | 'Tester';
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Developer', 'Tester'], required: true },
  avatarUrl: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
EOF

cat << 'EOF' > src/domain/models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  clientName?: string;
  projectType?: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  clientName: { type: String },
  projectType: { type: String },
  status: { type: String, default: 'Active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
EOF

cat << 'EOF' > src/domain/models/Environment.ts
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
EOF

cat << 'EOF' > src/domain/models/TestCase.ts
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
EOF

cat << 'EOF' > src/domain/models/TestRun.ts
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
EOF

cat << 'EOF' > src/domain/models/TestResult.ts
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
EOF

cat << 'EOF' > src/domain/models/Issue.ts
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
EOF

cat << 'EOF' > src/domain/models/RetestTask.ts
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
EOF

cat << 'EOF' > src/domain/models/UploadedFile.ts
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
EOF

cat << 'EOF' > src/domain/models/Comment.ts
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
EOF

cat << 'EOF' > src/domain/models/ActivityLog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
EOF
