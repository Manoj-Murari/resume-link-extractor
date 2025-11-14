import Link from "next/link";
import { FileText, Link as LinkIcon, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Resume Extractor
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Extract every detail from your resume including URLs, hyperlinks, email addresses, 
            and phone numbers from PDF, DOCX, DOC, or TXT files
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/resume-extractor">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Multiple Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Supports PDF, DOCX, DOC, and TXT files for maximum compatibility
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <LinkIcon className="w-10 h-10 text-primary mb-2" />
              <CardTitle>URL Extraction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically identifies and extracts all URLs and hyperlinks with platform detection
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Extracts email addresses and phone numbers in various formats
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Smart Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recognizes LinkedIn, GitHub, Twitter, Portfolio, and more social platforms
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Example Output</CardTitle>
              <CardDescription>
                Here's what you can expect after extracting details from a resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Links & Social Profiles
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                    <span className="font-medium">LinkedIn:</span>
                    <span className="text-muted-foreground">https://linkedin.com/in/johndoe</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                    <span className="font-medium">GitHub:</span>
                    <span className="text-muted-foreground">https://github.com/johndoe</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                    <span className="font-medium">Portfolio:</span>
                    <span className="text-muted-foreground">https://johndoe.dev</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Addresses
                </h3>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  john.doe@example.com
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Numbers
                </h3>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  +1 (555) 123-4567
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Extract?</h2>
          <p className="text-muted-foreground mb-8">
            Upload your resume now and get instant detailed extraction
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/resume-extractor">
              Try Resume Extractor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}