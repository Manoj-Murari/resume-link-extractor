import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Please upload PDF, DOCX, DOC, or TXT files.',
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(uploadsDir, `temp_${Date.now()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    try {
      // Execute Python script
      const scriptPath = join(process.cwd(), 'scripts', 'extract_resume.py');
      const { stdout, stderr } = await execAsync(
        `python3 "${scriptPath}" "${tempFilePath}"`
      );

      if (stderr && !stdout) {
        throw new Error(stderr);
      }

      const result = JSON.parse(stdout);

      // Clean up temp file
      await unlink(tempFilePath);

      return NextResponse.json(result);
    } catch (error: any) {
      // Clean up temp file on error
      try {
        await unlink(tempFilePath);
      } catch {}

      // Check if Python dependencies are missing
      if (error.message?.includes('ModuleNotFoundError') || 
          error.message?.includes('No module named')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Python dependencies not installed. Please run: pip install -r requirements.txt',
          },
          { status: 500 }
        );
      }

      throw error;
    }
  } catch (error: any) {
    console.error('Error extracting resume:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to extract resume',
      },
      { status: 500 }
    );
  }
}
