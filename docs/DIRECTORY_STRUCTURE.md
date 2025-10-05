# Project Directory Structure

Overview of the WebBaseline Pro project directory structure and file organization.

## 📁 Root Directory

```
WebBaseline-Pro/
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── CODE_OF_CONDUCT.md       # Community code of conduct
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── README.md                # Project overview and setup
├── SECURITY.md              # Security policy
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML file
├── netlify.toml             # Netlify deployment configuration
├── package.json             # Frontend package configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node-specific TypeScript config
└── vite.config.ts          # Vite build configuration
```

## 📁 Source Code Directories

### 🖥 Frontend (src/)

```
src/
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
├── vite-env.d.ts           # Vite TypeScript declarations
├── index.css               # Global styles
├── components/             # React components
│   ├── AnalysisChart.tsx
│   ├── AuthForm.tsx
│   ├── ComplianceBadge.tsx
│   ├── FeatureSupport.tsx
│   ├── FloatingChatbot.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── ScoreCard.tsx
│   └── Sidebar.tsx
├── context/                # React context providers
│   └── AuthContext.tsx
├── lib/                    # Utility libraries
│   ├── api.ts
│   └── supabase.ts
├── pages/                  # Application pages
│   ├── Analyze.tsx
│   ├── BaselineChatbot.tsx
│   ├── Comparison.tsx
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── Notifications.tsx
│   ├── Performance.tsx
│   ├── Profile.tsx
│   ├── Reports.tsx
│   ├── RouteExplorer.tsx
│   └── SecurityCenter.tsx
```

### ⚙️ Backend (server/)

```
server/
├── server.js               # Main server entry point
├── package.json            # Backend package configuration
├── config/                 # Configuration files
│   └── supabase.js
├── controllers/            # Route controllers
│   ├── authController.js
│   └── websiteController.js
├── routes/                 # API route definitions
│   ├── auth.js
│   └── websites.js
├── services/               # Business logic services
│   ├── analysisService.js
│   ├── baselineService.js
│   ├── comparisonService.js
│   ├── crawlerService.js
│   ├── lighthouseService.js
│   ├── reportService.js
│   └── webFeaturesService.js
├── utils/                  # Utility functions
│   └── websiteUtils.js
```

## 📁 Documentation (docs/)

```
docs/
├── README.md               # Documentation index
├── API.md                  # API reference
├── USER_GUIDE.md           # User guide
├── QUICK_START.md          # Quick start guide
├── TROUBLESHOOTING.md      # Troubleshooting guide
├── DIRECTORY_STRUCTURE.md  # This file
├── examples/               # Integration examples
│   ├── README.md
│   ├── javascript/
│   │   └── basic-analysis.js
│   └── python/
│       └── analyze.py
```

## 📁 Database (supabase/)

```
supabase/
└── migrations/             # Database migration scripts
    └── 20250926083239_wispy_bonus.sql
```

## 📁 Build and Deployment

```
dist/                       # Production build output
public/                     # Static assets
```

## 📁 Development Tools

```
node_modules/               # npm dependencies (git ignored)
.env                        # Environment variables (git ignored)
```

## 🗂 File Naming Conventions

### Component Files
- **PascalCase**: `UserProfile.tsx`, `NavigationMenu.tsx`
- **Descriptive names**: Reflect component purpose

### Utility Files
- **camelCase**: `apiUtils.ts`, `dateHelpers.ts`
- **Clear functionality**: Name indicates purpose

### Configuration Files
- **kebab-case**: `tailwind.config.js`, `vite.config.ts`
- **Standard extensions**: Use appropriate file extensions

### Documentation Files
- **UPPERCASE**: `README.md`, `LICENSE`
- **kebab-case**: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

## 📁 Best Practices

### Organization Principles
1. **Separation of Concerns**: Frontend, backend, and documentation are clearly separated
2. **Consistent Naming**: Follow established conventions for each file type
3. **Logical Grouping**: Related files are grouped in directories
4. **Scalability**: Structure supports project growth

### Directory Guidelines
1. **Flat is Better**: Avoid deeply nested directories when possible
2. **Clear Purpose**: Each directory should have a well-defined purpose
3. **Consistent Structure**: Similar directories follow the same pattern
4. **Documentation**: Include README files for complex directories

### File Guidelines
1. **Single Responsibility**: Each file should have one clear purpose
2. **Descriptive Names**: File names should clearly indicate content
3. **Consistent Extensions**: Use appropriate file extensions
4. **Proper Imports**: Use relative paths for local imports

## 🚀 Development Workflow

### Adding New Features
1. **Create directory**: Add new directory under appropriate parent
2. **Follow conventions**: Use established naming patterns
3. **Update documentation**: Add to this directory structure guide
4. **Test integration**: Ensure new files integrate properly

### Refactoring Existing Code
1. **Maintain structure**: Keep consistent with existing organization
2. **Update references**: Change import paths as needed
3. **Document changes**: Note structural changes in commit messages
4. **Update documentation**: Modify this guide when structure changes

## 📞 Support

For questions about the project structure:

- **GitHub Issues**: Report structural concerns
- **Contributing Guide**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Architecture Discussions**: Community forum
- **Pull Requests**: Propose structural improvements

---

**Last Updated**: October 5, 2025

This directory structure is designed to be intuitive and scalable. As the project grows, we may adjust the organization to maintain clarity and maintainability.