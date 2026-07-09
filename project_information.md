# Project Information: TestBridge

TestBridge is a comprehensive software testing management web application built using Next.js, tailored for both Developers and Testers. It enables complete test case management, execution, and automatic bug tracking.

## Core Features
1. **Role-Based Access Control**: Secure login and distinct views for 'Developer' and 'Tester' roles.
2. **Project & Environment Management**: Developers can define distinct projects and specific environments (URL, credentials, devices) to be tested.
3. **Test Case Handling**: Support for manual creation or CSV/Excel bulk import of test cases with step-by-step instructions and expected results.
4. **Test Assignment & Execution**: Developers assign test runs to testers; testers execute and record actual results with screenshots.
5. **Automatic Bug Workflow**: Failing a test case automatically spawns an issue for developers, logging all context and proof.
6. **Retesting Loop**: Once a developer marks an issue as fixed, a RetestTask is automatically routed back to the original tester.
7. **Cloudinary Integration**: Secure server-side image upload and management for proof of testing and bug validation.
8. **Reporting & Dashboards**: Summary views of project health, test pass/fail ratios, and tester velocity.

## Technology Stack
- **Frontend/Backend**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: MongoDB (via Mongoose)
- **File Storage**: Cloudinary
- **Authentication**: NextAuth.js
