# PSG Research - Internal Research Tool

A comprehensive web application for annotating and analyzing scenes from *Panty & Stocking with Garterbelt* anime, focusing on sacred inversion techniques.

## 🌟 Overview

PSG Research is an internal research application designed for a team of 3 researchers (Hiếu, Hà, Đài) to systematically catalog and analyze scenes using six sacred inversion techniques. The app features screenshot management, detailed scene annotation, multiple viewing modes, and comprehensive export capabilities.

## ✨ Key Features

### 🔐 Simple User System
- **No authentication required** - private, internal use only
- User selection screen with 3 team members:
  - **Hiếu** (Chủ nhiệm / Project Lead)
  - **Hà** (Thành viên / Member)
  - **Đài** (Thành viên / Member)
- All changes tracked by user

### 📝 Scene Recording
- **Quick Add Form** with comprehensive fields:
  - Episode selection (13 episodes)
  - Timestamp (start and optional end)
  - Screenshot upload/paste (Ctrl+V support)
  - Sacred Sign Type: Symbol, Ritual, Role, Object
  - Six Techniques (T1-T6) multi-select
  - Humor devices
  - Narrative function
  - Frame description
  - Quoted lines and translation notes
  - Visual and audio cues
  - Recontextualization notes
  - Technique reasoning
  - Confidence slider (0-100%)
  - Tags and status

### ⌨️ Keyboard Shortcuts
- **Ctrl+V** - Paste screenshot
- **1-6** - Toggle techniques T1-T6
- **S** - Save record
- **Esc** - Cancel/reset form

### 📊 Six Sacred Inversion Techniques

| ID | English Name | Vietnamese Name |
|----|--------------|-----------------|
| T1 | Consecration via Performance | Thánh hiến qua trình diễn |
| T2 | Desacralization by Recontextualization | Phi thiêng hóa qua tái bối cảnh hóa |
| T3 | Commodification of Merit | Giao dịch hóa công đức |
| T4 | Power as Spectacle | Quyền lực như trình diễn |
| T5 | Relic–Filth Oscillation | Dao động thánh tích / rác rưởi |
| T6 | Bureaucratization of Transcendence | Quan liêu hóa siêu việt |

### 📁 Multiple Views

1. **Dashboard** - Overview with statistics and recent records
2. **Quick Add** - Fast scene entry form
3. **Table View** - Sortable table with all records
4. **Timeline View** - Chronological view by episode
5. **Kanban View** - Organize by status or technique
6. **Gallery View** - Screenshot grid with lightbox

### 💾 Export & Backup

Export data in multiple formats:
- **Excel (.xlsx)** - Spreadsheet with all fields
- **Word (.docx)** - Research report grouped by technique
- **CSV (.csv)** - Plain text for analysis
- **JSON (.json)** - Raw data for import/export
- **Full Backup** - JSON with metadata

### 🎨 Status Tracking

- **Draft** - Initial entry
- **In Review** - Under review
- **Approved** - Verified and approved
- **Rejected** - Needs revision

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
The app runs on `http://localhost:5173` (or next available port)

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management (with persistence)
- **lucide-react** - Icons
- **xlsx** - Excel export
- **docx** - Word export
- **file-saver** - File downloads

## 📂 Project Structure

```
PSG/
├── src/
│   ├── components/       # Reusable components
│   │   ├── UserSelection.tsx
│   │   ├── Layout.tsx
│   │   └── ExportModal.tsx
│   ├── views/           # Main view components
│   │   ├── Dashboard.tsx
│   │   ├── QuickAdd.tsx
│   │   ├── TableView.tsx
│   │   ├── TimelineView.tsx
│   │   ├── KanbanView.tsx
│   │   └── GalleryView.tsx
│   ├── store/           # Zustand store
│   │   └── useAppStore.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── export.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json
```

## 💾 Data Storage

Data is stored in browser's localStorage using Zustand's persist middleware:
- Automatic save on every change
- Persists across sessions
- Export to backup regularly

## 📊 Data Schema

Each scene record includes:
- Episode and timestamp information
- Screenshot (base64 encoded)
- Sacred sign classification
- Technique selections (T1-T6)
- Humor devices
- Narrative analysis
- Quoted dialogue
- Translation and cultural notes
- Confidence rating
- Status tracking
- User attribution
- Timestamps

## 🎯 Usage Guidelines

### Adding a New Scene
1. Select your user from the main screen
2. Navigate to "Quick Add"
3. Select episode and enter timestamp
4. Upload or paste screenshot (Ctrl+V)
5. Fill in description and analysis fields
6. Select applicable techniques (use 1-6 keys)
7. Set confidence level
8. Save (press S or click Save)

### Organizing Records
- Use **Table View** for bulk editing and sorting
- Use **Timeline View** for chronological analysis
- Use **Kanban View** to track review status
- Use **Gallery View** to browse screenshots

### Exporting Data
1. Click "Export Data" in sidebar
2. Choose format (Excel, Word, CSV, JSON)
3. Optionally apply current filters
4. Download file

## 🔒 Security & Privacy

- **No authentication** - app assumes private, trusted environment
- **Local storage only** - data stays in browser
- **No external API calls**
- **Suitable for internal research team use**

## 📝 Future Enhancements

Potential features to add:
- Google Drive integration for cloud storage
- Collaborative editing
- Advanced search and filtering
- Statistical analysis charts
- Video timestamp linking
- Auto-backup scheduling

## 👥 Team

- **Hiếu** - Project Lead (Chủ nhiệm)
- **Hà** - Research Member (Thành viên)
- **Đài** - Research Member (Thành viên)

## 📄 License

Internal research tool - Private use only

## 🐛 Known Issues

- Large number of high-resolution screenshots may slow performance
- Export with many images may take time
- Browser localStorage has size limits (~10MB)

## 🤝 Support

For issues or questions, contact the project lead.

---

**Built with ❤️ for PSG Research Team**
