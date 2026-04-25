# Domain 4: Blog & CMS Management

## Features to Build

### Posts List `/admin/blog`
- Table: featured image thumbnail, title, author, categories, tags, status, views, date
- Filters: status (draft/published/scheduled/archived), author, category, date range
- Search: title, content snippet
- Bulk: publish, unpublish, delete, change author, export
- Column toggle: show/hide columns

### Post Editor `/admin/blog/new` and `/admin/blog/[id]/edit`
**Main area (70%)**
- Title input (large, full-width)
- Slug field (auto-generated from title, editable, live URL preview)
- Rich text / block editor (TipTap recommended):
  - Headings (H1–H4), paragraph, blockquote
  - Bold, italic, underline, strikethrough, code inline
  - Ordered/unordered lists
  - Code block with syntax highlighting
  - Image (upload or URL, with caption + alt)
  - Video embed (YouTube/Vimeo)
  - Table insert
  - Divider / horizontal rule
  - Call-to-action block (custom)
  - Table of contents auto-generator
- Word count + reading time estimate

**Sidebar (30%)**
- Publish panel:
  - Status: Draft / Published / Scheduled
  - Visibility: Public / Password protected / Private
  - Publish date picker (for scheduling)
  - Save draft button
  - Preview in new tab link
  - Publish / Update button

- Featured image:
  - Upload or select from media library
  - Alt text field

- Categories (checkbox tree)
- Tags (tag input with autocomplete)
- Author selector (dropdown of admin users)
- Excerpt / short description (textarea, 160 chars)
- Series (group related posts)

**SEO tab (slide-over or bottom section)**
- Meta title (60 char limit counter)
- Meta description (155 char limit)
- Focus keyword
- OG Image (separate from featured image)
- Twitter card preview
- Readability score (Flesch-Kincaid, optional)
- Internal links checker

### Pages (Static Content) `/admin/pages`
- Same editor as posts but without categories/tags
- Page template selector (full-width / sidebar / landing)
- Parent page selector (for nested URL structure: `/about/team`)
- Show in navigation toggle
- Navigation order

### Categories Management
- Nested tree with drag-to-reorder
- Each category: name, slug, description, parent, image, post count
- Merge categories (move all posts from A to B, delete A)

### Tags Management
- Flat list with search
- Merge duplicate tags
- Tag cloud view (size by usage)
- Bulk delete unused tags

### Comments / Discussion
- Comment list: post title, commenter name, email, IP, comment text, date, status
- Statuses: pending / approved / spam / trash
- Bulk: approve, spam, delete
- Reply from admin inline
- Spam filter settings (keyword blocklist, hold for moderation rules)

### Media Library (integrated)
- See Domain 6 (media.md) for full details
- Accessible inline from post editor image block

### Data Models
```ts
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML or JSON (TipTap)
  excerpt?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  visibility: 'public' | 'private' | 'password';
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId: string;
  categoryIds: string[];
  tagIds: string[];
  featuredImage?: string;
  seriesId?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  readingTime?: number; // minutes
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  postCount: number;
}
```

### Key UI Patterns
- Autosave: save draft every 30 seconds, show "Last saved 2 min ago"
- Unsaved changes warning: prompt on navigate away if unsaved
- Revision history: list of saved versions, click to preview/restore
- Scheduled publish: calendar date-time picker, show "Will publish in 3 hours"
- Preview: open in new tab with `?preview=true&token=xxx` URL
- Permalink editor: inline edit below title, show full URL, validate uniqueness
