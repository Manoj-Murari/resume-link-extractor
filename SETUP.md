# Resume Extractor Setup Guide

This project extracts detailed information from resumes including URLs, hyperlinks, email addresses, and phone numbers from PDF, DOCX, DOC, and TXT files.

## Prerequisites

- **Node.js** (v18 or higher)
- **Python 3** (v3.8 or higher)
- **pip** (Python package manager)

## Installation Steps

### 1. Install Node.js Dependencies

```bash
npm install
# or
bun install
```

### 2. Install Python Dependencies

The project requires two Python libraries:
- **PyMuPDF** (for PDF extraction)
- **python-docx** (for DOCX/DOC extraction)

Install them using pip:

```bash
pip install -r requirements.txt
```

Or install individually:

```bash
pip install PyMuPDF==1.23.8
pip install python-docx==1.1.0
```

### 3. Verify Python Installation

Test that Python is accessible:

```bash
python3 --version
```

Test that the required packages are installed:

```bash
python3 -c "import fitz; import docx; print('All packages installed successfully!')"
```

### 4. Create Required Directories

The application will automatically create an `uploads` directory for temporary file storage, but you can create it manually:

```bash
mkdir -p uploads
```

### 5. Start the Development Server

```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── scripts/
│   └── extract_resume.py       # Python script for resume extraction
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── extract-resume/
│   │   │       └── route.ts    # API endpoint for file processing
│   │   ├── resume-extractor/
│   │   │   └── page.tsx        # Resume extractor page
│   │   └── page.tsx            # Homepage
│   └── components/
│       └── ResumeUploader.tsx  # File upload component
├── uploads/                     # Temporary file storage (auto-created)
├── requirements.txt             # Python dependencies
└── SETUP.md                     # This file
```

## How It Works

1. **Upload**: User uploads a resume file (PDF, DOCX, DOC, or TXT)
2. **Processing**: The file is sent to the Next.js API route
3. **Extraction**: The API route calls the Python script which extracts:
   - All text content
   - URLs and hyperlinks (with platform detection)
   - Email addresses
   - Phone numbers (various formats)
4. **Display**: Results are displayed in an organized format

## Supported File Formats

- **PDF** (.pdf) - Uses PyMuPDF to extract text and hyperlinks
- **DOCX** (.docx) - Uses python-docx to extract text and hyperlinks
- **DOC** (.doc) - Uses python-docx
- **TXT** (.txt) - Plain text parsing

## Platform Detection

The extractor automatically identifies links from:
- LinkedIn
- GitHub
- Twitter/X
- Medium
- Stack Overflow
- Behance
- Dribbble
- Portfolio sites
- Generic URLs

## Troubleshooting

### Python not found

If you get "python3: command not found", try:
- On Windows: Use `python` instead of `python3` in the API route
- Install Python from python.org
- Ensure Python is in your PATH

### Module not found errors

If you see "ModuleNotFoundError: No module named 'fitz'" or similar:
```bash
pip install --upgrade PyMuPDF python-docx
```

### Permission errors

If you get permission errors with the uploads directory:
```bash
chmod 755 uploads
```

### File size limits

By default, Next.js limits file uploads to 4.5MB. To increase this, add to `next.config.ts`:

```typescript
export default {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

## Testing the Python Script Directly

You can test the Python script directly:

```bash
python3 scripts/extract_resume.py /path/to/resume.pdf
```

This will output JSON with the extracted data.

## Security Notes

- Uploaded files are stored temporarily and deleted after processing
- Files are stored in the `uploads` directory with unique timestamped names
- Only allowed file types (PDF, DOCX, DOC, TXT) are processed
- File validation happens on both client and server sides

## Production Deployment

For production deployment:

1. Ensure Python 3 is available on the server
2. Install Python dependencies on the server
3. Set appropriate file upload size limits
4. Configure proper file cleanup/maintenance
5. Consider using a proper file storage service (S3, etc.) for larger scale

## Support

For issues or questions:
1. Check that all dependencies are installed
2. Verify Python version compatibility
3. Ensure file permissions are correct
4. Check server logs for detailed error messages
