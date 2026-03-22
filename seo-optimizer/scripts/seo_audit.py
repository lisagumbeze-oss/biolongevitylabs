import os
import re
import sys

def get_files(directory, extensions):
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                yield os.path.join(root, file)

def audit_alt_tags(content):
    errors = []
    # Check for <img tags without alt or with empty alt
    img_matches = re.finditer(r'<img[^>]*>', content)
    for match in img_matches:
        img_tag = match.group(0)
        if 'alt=' not in img_tag or re.search(r'alt=["\']\s*["\']', img_tag):
            errors.append(f"Missing or empty alt tag in: {img_tag}")
    
    # Check for <Image components (Next.js)
    next_img_matches = re.finditer(r'<Image[^>]*>', content)
    for match in next_img_matches:
        img_tag = match.group(0)
        if 'alt=' not in img_tag or re.search(r'alt=["\']\s*["\']', img_tag):
            errors.append(f"Missing or empty alt tag in Next.js Image: {img_tag}")
    return errors

def audit_metadata(file_path, content):
    if not file_path.endswith('page.tsx'):
        return []
    
    if 'export const metadata' not in content and 'generateMetadata' not in content:
        return [f"Missing metadata export in page: {file_path}"]
    return []

def audit_headings(content):
    errors = []
    headings = re.findall(r'<h([1-6])[^>]*>(.*?)</h\1>', content, re.DOTALL)
    if not headings:
        return []
    
    levels = [int(h[0]) for h in headings]
    
    # Check for more than one h1
    if levels.count(1) > 1:
        errors.append(f"Multiple H1 tags found ({levels.count(1)})")
        
    # Check for sequential hierarchy (optional but good)
    for i in range(len(levels) - 1):
        if levels[i+1] > levels[i] + 1:
            errors.append(f"Header level skipped: H{levels[i]} to H{levels[i+1]}")
            
    return errors

def main():
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src'))
    results = {
        "alt_tags": [],
        "metadata": [],
        "headings": []
    }
    
    print(f"Starting SEO Audit on: {path}\n")
    
    for file_path in get_files(path, ['.tsx', '.ts']):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            results["alt_tags"].extend([(file_path, e) for e in audit_alt_tags(content)])
            results["metadata"].extend([(file_path, e) for e in audit_metadata(file_path, content)])
            results["headings"].extend([(file_path, e) for e in audit_headings(content)])

    # Print Report
    total_issues = sum(len(v) for v in results.values())
    print(f"Audit Complete. Found {total_issues} potential issues.\n")
    
    if results["metadata"]:
        print("--- Metadata Issues ---")
        for file, msg in results["metadata"]:
            print(f"- {msg}")
        print()

    if results["alt_tags"]:
        print("--- Alt Tag Issues ---")
        for file, msg in results["alt_tags"]:
            print(f"- {os.path.relpath(file, path)}: {msg}")
        print()

    if results["headings"]:
        print("--- Heading Issues ---")
        for file, msg in results["headings"]:
            print(f"- {os.path.relpath(file, path)}: {msg}")
        print()

if __name__ == "__main__":
    main()
