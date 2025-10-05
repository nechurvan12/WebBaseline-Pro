# Contributing to WebBaseline Pro

👋 First off, thanks for taking the time to contribute! We're excited to welcome you to the WebBaseline Pro community.

## 🚀 Getting Started

1. **Fork the Repository**
   ```bash
   # Clone your fork
   git clone https://github.com/your-username/WebBaseline-Pro.git
   cd WebBaseline-Pro
   
   # Add upstream remote
   git remote add upstream https://github.com/daxp472/WebBaseline-Pro.git
   ```

2. **Set Up Development Environment**

   Frontend Setup:
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Start development server
   npm run dev
   ```

   Backend Setup:
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

## 🧩 Contribution Workflow

1. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Follow the project structure
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "type: brief description"
   ```
   
   Commit message types:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Formatting, missing semicolons, etc.
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

4. **Submit Pull Request**
   - Push to your fork
   - Create PR to the `dev` branch
   - Fill out the PR template
   - Wait for review and address feedback

## 🧠 Code Style

### General Guidelines
- Use TypeScript for new code
- Follow existing patterns in the codebase
- Write self-documenting code with clear variable names
- Add comments for complex logic

### Naming Conventions
- **Components:** PascalCase (`UserProfile.tsx`)
- **Files:** camelCase (`authUtils.ts`)
- **Functions:** camelCase (`getUserData()`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Variables:** camelCase (`userCount`)

### Formatting
- Use 2 spaces for indentation
- Add trailing commas in arrays/objects
- Keep lines under 80 characters
- Use semicolons consistently

## 🧪 Testing

Before submitting your PR:

1. **Run Tests**
   ```bash
   # Frontend tests
   npm run test
   
   # Backend tests
   cd server && npm run test
   ```

2. **Manual Testing**
   - Test your changes in development
   - Verify mobile responsiveness
   - Check browser compatibility
   - Ensure no console errors

## 📝 Creating Issues

### Bug Reports
- Use the bug report template
- Include steps to reproduce
- Specify expected vs actual behavior
- Add screenshots if relevant
- List environment details

### Feature Requests
- Use the feature request template
- Explain the use case
- Describe expected behavior
- Add mockups if possible

## 🙌 Acknowledgements

We appreciate all contributors who help improve WebBaseline Pro! Check out our [contributors page](https://github.com/daxp472/WebBaseline-Pro/graphs/contributors) to see all the awesome people who have contributed to this project.

---

Remember: We aim to maintain a positive and inclusive environment. Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all your interactions with the project.