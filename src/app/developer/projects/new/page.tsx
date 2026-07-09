"use client";

import { createProject } from "@/actions/projectActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/developer/projects" className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
          <p className="text-sm text-slate-500 mt-1">Set up a new testing project for your client.</p>
        </div>
        
        <form action={createProject} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900"
              placeholder="e.g., E-Commerce App Revamp"
            />
          </div>
          
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900"
              placeholder="e.g., Acme Corp"
            />
          </div>
          
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-1">Project Type</label>
            <select
              id="projectType"
              name="projectType"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="Web App">Web Application</option>
              <option value="Mobile App">Mobile Application (iOS/Android)</option>
              <option value="Desktop App">Desktop Application</option>
              <option value="API">API Services</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 resize-none"
              placeholder="Brief description of the project goals and testing scope..."
            ></textarea>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Link href="/developer/projects">
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">Create Project</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
