# Contributing to WebBaseline Pro

👋 **Welcome to the WebBaseline Pro Community!**

Thank you for your interest in contributing to WebBaseline Pro - a production-ready web analysis platform built on Google's official Baseline standards. We're excited to have you join our community of developers, designers, and enthusiasts working to make the web a better place.

## 🚀 Getting Started

### 🍴 Fork & Clone

1. **Fork the Repository**
   ```bash
   # Fork using GitHub UI or CLI
   gh repo fork daxp472/WebBaseline-Pro
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/WebBaseline-Pro.git
   cd WebBaseline-Pro
   
   # Add upstream remote
   git remote add upstream https://github.com/daxp472/WebBaseline-Pro.git
   ```

3. **Set Up Development Environment**

   **Frontend Setup:**
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Start development server
   npm run dev
   ```

   **Backend Setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

## 🧩 Contribution Workflow

### 🌿 Branch Strategy

We follow the Git Feature Branch Workflow:

1. **Create a New Branch**
   ```bash
   # For features
   git checkout -b feature/your-feature-name
   
   # For bug fixes
   git checkout -b fix/your-bug-fix
   
   # For documentation
   git checkout -b docs/your-documentation-update
   ```

2. **Make Your Changes**
   - Follow the existing project structure
   - Write clean, well-documented code
   - Add tests where applicable
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "type(scope): brief description"
   ```
   
   **Commit Message Types:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Formatting, missing semicolons, etc.
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks
   - `perf:` - Performance improvements
   - `ci:` - CI/CD related changes

4. **Submit Pull Request**
   - Push to your fork: `git push origin branch-name`
   - Create PR to the `main` branch
   - Fill out the PR template completely
   - Wait for review and address feedback

## 🧠 Code Style & Standards

### 🎨 General Guidelines

- **Type Safety**: Use TypeScript for all new code
- **Consistency**: Follow existing patterns in the codebase
- **Readability**: Write self-documenting code with clear variable names
- **Documentation**: Add comments for complex logic and public APIs
- **Performance**: Consider performance implications of your changes

### 🏷️ Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: camelCase (`authUtils.ts`) or PascalCase for components
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Variables**: camelCase (`userCount`)
- **Interfaces**: PascalCase with `I` prefix (`IUser`, `IAnalysisResult`)

### 📐 Formatting Standards

- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Keep lines under 100 characters
- **Semicolons**: Use semicolons consistently
- **Trailing Commas**: Add trailing commas in arrays/objects
- **Quotes**: Use single quotes (`'`) for strings

### 🧪 Testing Requirements

- **Unit Tests**: Write tests for new functionality
- **Integration Tests**: Test API endpoints and services
- **E2E Tests**: For critical user flows
- **Test Coverage**: Aim for >80% test coverage for new features

## 🧪 Testing Guidelines

Before submitting your PR, ensure all tests pass:

1. **Run Frontend Tests**
   ```bash
   npm run test
   npm run test:coverage
   ```

2. **Run Backend Tests**
   ```bash
   cd server
   npm run test
   npm run test:coverage
   ```

3. **Manual Testing**
   - Test your changes in development environment
   - Verify mobile responsiveness
   - Check cross-browser compatibility
   - Ensure no console errors or warnings
   - Test accessibility features

## 📝 Creating Issues

### 🐛 Bug Reports

Use the bug report template and include:

- **Clear title** describing the issue
- **Steps to reproduce** with specific details
- **Expected vs actual behavior**
- **Environment details** (browser, OS, version)
- **Screenshots or videos** if relevant
- **Console errors** or logs

### 💡 Feature Requests

Use the feature request template and include:

- **Clear description** of the feature
- **Use case** and problem it solves
- **Expected behavior** with examples
- **Mockups or diagrams** if UI changes
- **Technical considerations** if any

### 🔧 Enhancement Requests

For improvements to existing features:

- **Current limitations** you've identified
- **Proposed solution** with technical details
- **Impact assessment** on users and performance
- **Implementation approach** suggestions

## 🛠 Development Tools & Setup

### 📦 Required Tools

- **Node.js** 18+ (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- **Git** 2.30+
- **VS Code** (recommended editor)

### 🔧 Recommended VS Code Extensions

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript Importer** for imports
- **GitLens** for Git integration
- **Auto Rename Tag** for HTML tags

### 🧪 Debugging Setup

- **Frontend**: React DevTools, Redux DevTools
- **Backend**: Node.js debugger, Postman for API testing
- **Database**: Supabase dashboard for data inspection

## 📋 Code Review Process

### 🎯 Review Criteria

All pull requests are reviewed based on:

1. **Functionality**: Does it work as expected?
2. **Code Quality**: Is it well-written and maintainable?
3. **Performance**: Any performance implications?
4. **Security**: Any security vulnerabilities?
5. **Testing**: Are tests comprehensive and passing?
6. **Documentation**: Is it properly documented?

### ⏱ Review Timeline

- **Standard PRs**: 2-3 business days
- **Urgent fixes**: Within 24 hours
- **Large features**: May take 5-7 business days

### 🔄 Review Process

1. Automated checks (CI/CD) run on all PRs
2. At least one core maintainer reviews the code
3. Feedback provided with specific suggestions
4. Author addresses feedback and requests re-review
5. PR merged after approval and passing checks

## 🎉 Recognition & Community

### 🏆 Contributor Recognition

We value all contributions and recognize contributors through:

- **GitHub Contributors Page**
- **Monthly Contributor Spotlight**
- **Hackathon Participation Opportunities**
- **Swag Rewards** for significant contributions

### 🤝 Community Engagement

- Join our [Discord Community](link-to-discord) for real-time discussions
- Participate in monthly community calls
- Share your projects built with WebBaseline Pro
- Mentor new contributors

## 🙌 Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md) which promotes:

- **Respect** for all community members
- **Inclusivity** and diverse perspectives
- **Constructive feedback** and collaboration
- **Professional communication** standards

## 📞 Getting Help

### 🆘 Need Assistance?

- **GitHub Discussions**: For general questions and community support
- **Issues**: For bug reports and feature requests
- **Documentation**: Check existing docs before asking
- **Stack Overflow**: Tag questions with `webbaseline-pro`

### 🎓 Learning Resources

- **Project Wiki**: Detailed technical documentation
- **API Reference**: Complete API documentation
- **Video Tutorials**: Getting started guides
- **Sample Projects**: Example implementations

---

## 🚀 Ready to Contribute?

1. **Read the docs** - Familiarize yourself with the project
2. **Pick an issue** - Start with `good first issue` or `help wanted`
3. **Ask questions** - Don't hesitate to reach out for clarification
4. **Submit your PR** - We're excited to see your contributions!

> **Remember**: Every contribution, no matter how small, makes a difference. Thank you for helping make WebBaseline Pro better for everyone!

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)