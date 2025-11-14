import ResumeUploader from '@/components/ResumeUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Resume Extractor - Extract Details from Resumes',
  description: 'Extract all details from resumes including URLs, hyperlinks, emails, and phone numbers',
};

export default function ResumeExtractorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-3">Resume Extractor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Upload your resume to extract all details including contact information, 
            URLs, social media links, and hyperlinks from PDF, DOCX, DOC, or TXT files.
          </p>
        </div>

        <ResumeUploader />

        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload File</h3>
              <p className="text-sm text-muted-foreground">
                Select or drag & drop your resume in PDF, DOCX, DOC, or TXT format
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Extract Details</h3>
              <p className="text-sm text-muted-foreground">
                Our Python-powered backend extracts all text, URLs, hyperlinks, and contact info
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">View Results</h3>
              <p className="text-sm text-muted-foreground">
                Get organized results with platform identification for LinkedIn, GitHub, and more
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-3">Supported Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {['LinkedIn', 'GitHub', 'Twitter/X', 'Portfolio', 'Medium', 'Stack Overflow', 'Behance', 'Dribbble'].map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1 bg-background border rounded-full text-sm"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
