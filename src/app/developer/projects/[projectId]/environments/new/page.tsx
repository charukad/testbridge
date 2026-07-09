"use client";

import { createEnvironment } from "@/actions/environmentActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewEnvironmentPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/developer/projects/${params.projectId}/environments`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Environments
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Add Testing Environment</h1>
          <p className="text-sm text-slate-500 mt-1">Configure credentials and URLs for testers to use.</p>
        </div>
        
        <form action={createEnvironment} className="p-6 space-y-6">
          <input type="hidden" name="projectId" value={params.projectId} />
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Environment Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
              placeholder="e.g., Staging, Production, iOS Build 102"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="appUrl" className="block text-sm font-medium text-slate-700 mb-1">App URL</label>
              <input
                type="url"
                id="appUrl"
                name="appUrl"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                placeholder="https://staging.example.com"
              />
            </div>
            <div>
              <label htmlFor="apiBaseUrl" className="block text-sm font-medium text-slate-700 mb-1">API Base URL</label>
              <input
                type="url"
                id="apiBaseUrl"
                name="apiBaseUrl"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Test Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="encryptedPassword" className="block text-sm font-medium text-slate-700 mb-1">Test Password</label>
              <input
                type="text"
                id="encryptedPassword"
                name="encryptedPassword"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="browser" className="block text-sm font-medium text-slate-700 mb-1">Browser / OS</label>
              <input
                type="text"
                id="browser"
                name="browser"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                placeholder="e.g., Chrome 120, iOS 17"
              />
            </div>
            <div>
              <label htmlFor="buildVersion" className="block text-sm font-medium text-slate-700 mb-1">Build Version</label>
              <input
                type="text"
                id="buildVersion"
                name="buildVersion"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                placeholder="e.g., v1.2.4-beta"
              />
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-slate-700 mb-1">Testing Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 resize-none"
              placeholder="Any specific setup instructions for the tester..."
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Link href={`/developer/projects/${params.projectId}/environments`}>
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">Create Environment</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
