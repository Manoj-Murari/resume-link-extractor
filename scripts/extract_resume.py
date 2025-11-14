#!/usr/bin/env python3
"""
Resume extraction script that extracts text, URLs, and hyperlinks from PDF, DOCX, and TXT files.
"""

import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Any

def extract_urls_from_text(text: str) -> List[Dict[str, str]]:
    """Extract URLs from plain text using regex."""
    url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    urls = re.findall(url_pattern, text)
    
    result = []
    seen = set()
    
    for url in urls:
        if url not in seen:
            seen.add(url)
            # Try to identify the platform
            platform = "URL"
            url_lower = url.lower()
            if "linkedin.com" in url_lower:
                platform = "LinkedIn"
            elif "github.com" in url_lower:
                platform = "GitHub"
            elif "twitter.com" in url_lower or "x.com" in url_lower:
                platform = "Twitter/X"
            elif "portfolio" in url_lower or "personal" in url_lower:
                platform = "Portfolio"
            elif "medium.com" in url_lower:
                platform = "Medium"
            elif "stackoverflow.com" in url_lower:
                platform = "Stack Overflow"
            elif "behance.net" in url_lower:
                platform = "Behance"
            elif "dribbble.com" in url_lower:
                platform = "Dribbble"
            
            result.append({"platform": platform, "url": url})
    
    return result

def extract_from_txt(file_path: str) -> Dict[str, Any]:
    """Extract content from TXT file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        urls = extract_urls_from_text(text)
        
        # Extract email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = list(set(re.findall(email_pattern, text)))
        
        # Extract phone numbers (various formats)
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = list(set(re.findall(phone_pattern, text)))
        
        return {
            "success": True,
            "text": text,
            "urls": urls,
            "emails": emails,
            "phones": [p if isinstance(p, str) else ''.join(p) for p in phones],
            "word_count": len(text.split())
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def extract_from_pdf(file_path: str) -> Dict[str, Any]:
    """Extract content from PDF file using PyMuPDF."""
    try:
        import fitz  # PyMuPDF
        
        doc = fitz.open(file_path)
        text = ""
        urls = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += page.get_text()
            
            # Extract hyperlinks from PDF
            links = page.get_links()
            for link in links:
                if 'uri' in link:
                    url = link['uri']
                    platform = "URL"
                    url_lower = url.lower()
                    
                    if "linkedin.com" in url_lower:
                        platform = "LinkedIn"
                    elif "github.com" in url_lower:
                        platform = "GitHub"
                    elif "twitter.com" in url_lower or "x.com" in url_lower:
                        platform = "Twitter/X"
                    elif "portfolio" in url_lower:
                        platform = "Portfolio"
                    elif "medium.com" in url_lower:
                        platform = "Medium"
                    elif "stackoverflow.com" in url_lower:
                        platform = "Stack Overflow"
                    
                    urls.append({"platform": platform, "url": url})
        
        doc.close()
        
        # Also extract URLs from text
        text_urls = extract_urls_from_text(text)
        
        # Merge and deduplicate
        all_urls = urls + text_urls
        seen_urls = set()
        unique_urls = []
        for url_info in all_urls:
            if url_info['url'] not in seen_urls:
                seen_urls.add(url_info['url'])
                unique_urls.append(url_info)
        
        # Extract emails
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = list(set(re.findall(email_pattern, text)))
        
        # Extract phone numbers
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = list(set(re.findall(phone_pattern, text)))
        
        return {
            "success": True,
            "text": text,
            "urls": unique_urls,
            "emails": emails,
            "phones": [p if isinstance(p, str) else ''.join(p) for p in phones],
            "word_count": len(text.split())
        }
    except ImportError:
        return {"success": False, "error": "PyMuPDF (fitz) not installed. Run: pip install PyMuPDF"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def extract_from_docx(file_path: str) -> Dict[str, Any]:
    """Extract content from DOCX file using python-docx."""
    try:
        from docx import Document
        
        doc = Document(file_path)
        text = ""
        hyperlinks = []
        
        # Extract text and hyperlinks from paragraphs
        for para in doc.paragraphs:
            text += para.text + "\n"
            
            # Extract hyperlinks from paragraph
            for run in para.runs:
                if run.element.tag.endswith('hyperlink'):
                    for child in run.element:
                        if child.tag.endswith('hyperlink'):
                            url = child.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                            if url:
                                hyperlinks.append(url)
        
        # Also check relationships for hyperlinks
        try:
            for rel in doc.part.rels.values():
                if "hyperlink" in rel.reltype:
                    url = rel.target_ref
                    platform = "URL"
                    url_lower = url.lower()
                    
                    if "linkedin.com" in url_lower:
                        platform = "LinkedIn"
                    elif "github.com" in url_lower:
                        platform = "GitHub"
                    elif "twitter.com" in url_lower or "x.com" in url_lower:
                        platform = "Twitter/X"
                    elif "portfolio" in url_lower:
                        platform = "Portfolio"
                    elif "medium.com" in url_lower:
                        platform = "Medium"
                    elif "stackoverflow.com" in url_lower:
                        platform = "Stack Overflow"
                    
                    hyperlinks.append({"platform": platform, "url": url})
        except:
            pass
        
        # Extract URLs from text
        text_urls = extract_urls_from_text(text)
        
        # Merge and deduplicate
        all_urls = hyperlinks + text_urls
        seen_urls = set()
        unique_urls = []
        for url_info in all_urls:
            url = url_info if isinstance(url_info, dict) else {"platform": "URL", "url": str(url_info)}
            if url['url'] not in seen_urls:
                seen_urls.add(url['url'])
                unique_urls.append(url)
        
        # Extract emails
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = list(set(re.findall(email_pattern, text)))
        
        # Extract phone numbers
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = list(set(re.findall(phone_pattern, text)))
        
        return {
            "success": True,
            "text": text,
            "urls": unique_urls,
            "emails": emails,
            "phones": [p if isinstance(p, str) else ''.join(p) for p in phones],
            "word_count": len(text.split())
        }
    except ImportError:
        return {"success": False, "error": "python-docx not installed. Run: pip install python-docx"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def extract_resume(file_path: str) -> Dict[str, Any]:
    """Main function to extract resume details based on file type."""
    path = Path(file_path)
    
    if not path.exists():
        return {"success": False, "error": "File not found"}
    
    extension = path.suffix.lower()
    
    if extension == '.pdf':
        return extract_from_pdf(file_path)
    elif extension in ['.docx', '.doc']:
        return extract_from_docx(file_path)
    elif extension == '.txt':
        return extract_from_txt(file_path)
    else:
        return {"success": False, "error": f"Unsupported file type: {extension}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = extract_resume(file_path)
    print(json.dumps(result, indent=2))
