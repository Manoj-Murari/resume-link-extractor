"use client";

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExtractedData {
  success: boolean;
  text?: string;
  urls?: Array<{ platform: string; url: string }>;
  emails?: string[];
  phones?: string[];
  word_count?: number;
  error?: string;
}

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (!validTypes.includes(file.type)) {
      setExtractedData({
        success: false,
        error: 'Invalid file type. Please upload PDF, DOCX, DOC, or TXT files.',
      });
      return;
    }

    setFile(file);
    setExtractedData(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setExtractedData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setExtractedData(data);
    } catch (error: any) {
      setExtractedData({
        success: false,
        error: error.message || 'Failed to extract resume data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedData(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>
            Upload your resume in PDF, DOCX, DOC, or TXT format to extract all details including URLs and hyperlinks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleChange}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select File
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: PDF, DOCX, DOC, TXT
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Remove
                </Button>
              </div>

              <Button
                onClick={handleUpload}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  'Extract Resume Details'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {extractedData.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Extraction Results
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  Extraction Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {extractedData.success ? (
              <>
                {extractedData.urls && extractedData.urls.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Links & Social Profiles
                    </h3>
                    <div className="space-y-2">
                      {extractedData.urls.map((urlInfo, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <Badge variant="outline">{urlInfo.platform}</Badge>
                          <a
                            href={urlInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline truncate flex-1"
                          >
                            {urlInfo.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {extractedData.emails && extractedData.emails.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Addresses
                    </h3>
                    <div className="space-y-2">
                      {extractedData.emails.map((email, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg text-sm"
                        >
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {extractedData.phones && extractedData.phones.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Numbers
                    </h3>
                    <div className="space-y-2">
                      {extractedData.phones.map((phone, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg text-sm"
                        >
                          {phone}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {extractedData.text && (
                  <div>
                    <h3 className="font-semibold mb-3">Extracted Text</h3>
                    <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {extractedData.text}
                      </pre>
                    </div>
                    {extractedData.word_count && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Word count: {extractedData.word_count}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Alert variant="destructive">
                <XCircle className="w-4 h-4" />
                <AlertDescription>{extractedData.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
