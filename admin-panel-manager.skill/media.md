# Domain 6: Media & Asset Management

## Features to Build

### Media Library `/admin/media`
- Grid view (default): thumbnail cards with filename, type badge, size, upload date
- List view toggle: table with all metadata
- Filters: file type (images / video / audio / documents), date range, uploader, size range
- Search: by filename, alt text, caption
- Bulk: delete, move to folder, download ZIP

### Upload
- Drag-and-drop upload zone (full page or modal)
- Click to browse file picker
- Multi-file upload with progress bars
- Paste from clipboard (image)
- Import from URL
- File type validation: allowed types, max size (configurable in settings)
- Auto-optimize images on upload: compress, strip EXIF (configurable)
- Generate responsive sizes: thumbnail (150×150), medium (300×300), large (1024px wide)

### Asset Detail (click any asset)
- Preview: image renders full-size, video plays, PDF shows first page
- Metadata panel:
  - Filename (editable)
  - Alt text (editable, important for SEO/accessibility)
  - Caption (editable)
  - Description
  - File type, size, dimensions (images), duration (video/audio)
  - Upload date, uploader name
  - URL (copy button)
  - Used in: list of posts/products/pages that reference this asset

### Image Editor (built-in, basic)
- Crop (aspect ratio presets or freeform)
- Resize to exact dimensions
- Rotate / flip
- Brightness / contrast sliders (optional)
- Save as new file or overwrite

### Folders / Organization
- Create folders / subfolders
- Move files to folders
- Folder tree sidebar
- Drag files between folders
- "Uncategorized" default folder

### Storage Settings
- Storage provider: Local / AWS S3 / Cloudflare R2 / Supabase Storage / Cloudinary
- CDN URL prefix configuration
- Storage usage meter (used / total quota)
- Auto-delete unused assets option

### Data Models
```ts
interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number; // bytes
  url: string;
  cdnUrl?: string;
  altText?: string;
  caption?: string;
  description?: string;
  folderId?: string;
  width?: number; // images/video
  height?: number;
  duration?: number; // video/audio in seconds
  uploadedBy: string; // admin user id
  usedIn: { type: 'post' | 'product' | 'page'; id: string; title: string }[];
  createdAt: Date;
}

interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  assetCount: number;
  createdAt: Date;
}
```

### Key UI Patterns
- Grid masonry: images shown at natural ratio, not all square-cropped
- Selection mode: click asset → checked state, selected count badge, bulk action bar appears
- Inline rename: double-click filename to rename in place
- Copy URL: single click copies CDN URL, shows "Copied!" for 2s
- Used in panel: show linked content so admin knows before deleting ("This image is used in 3 posts")
- Delete guard: warn if asset is in use, require explicit override to delete
