# Contributing Guide

Welcome! Here's how to contribute to the ecosystem.

## 🎯 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/repo`
3. Create feature branch: `git checkout -b feature/your-feature`
4. Install dependencies: `bash scripts/install-all.sh`
5. Run locally: `bash scripts/dev.sh`

## 💻 Development Workflow

### Code Style

**JavaScript/TypeScript**
```bash
cd code-reviewer  # or pdf-analyzer-web
npm run format   # Prettier
npm run lint     # ESLint
npm run type-check  # TypeScript
```

**Python**
```bash
cd pdf-analyzer-api
black main.py    # Format
pylint main.py   # Lint
mypy main.py     # Type check
```

### Testing

```bash
# Run all tests
pytest tests/

# Run integration tests
bash tests/test_integration.sh

# Run with coverage
pytest --cov=. tests/
```

### Building

```bash
# Frontend
npm run build

# Backend (Docker)
docker build -t pdf-analyzer-api pdf-analyzer-api/
```

## 📝 Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `perf`: Performance improvement
- `test`: Test addition
- `chore`: Dependencies/tooling

Example:
```
feat(api): add batch PDF analysis endpoint

Allow users to analyze multiple PDFs in one request.
Improves efficiency for bulk operations.

Closes #123
```

## 🔄 Pull Request Process

1. **Before submitting:**
   - Run tests: `npm test` / `pytest`
   - Lint code: `npm run lint` / `pylint`
   - Format code: `npm run format` / `black`

2. **Create PR:**
   - Clear title and description
   - Link related issues
   - Include test cases
   - Update documentation

3. **Review:**
   - Address feedback promptly
   - Keep commits atomic
   - Rebase if needed

4. **Merge:**
   - Squash commits if many
   - Delete branch
   - Close related issues

## 📂 Project Structure

```
code-reviewer/          # Next.js code review app
pdf-analyzer-api/       # FastAPI backend
pdf-analyzer-web/       # Next.js frontend
scripts/                # Helper scripts
tests/                  # Test files
.github/workflows/      # CI/CD
MONITORING.md          # Monitoring guide
DEPLOYMENT_INSTRUCTIONS.md
```

## 🐛 Bug Reports

1. Check if already reported
2. Provide:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

## 🎨 Feature Requests

1. Describe the feature
2. Use cases and benefits
3. Proposed implementation
4. Any concerns or limitations

## 📚 Documentation

- Update README.md for major changes
- Add docstrings to new functions
- Keep DEPLOYMENT_INSTRUCTIONS.md current
- Update MONITORING.md for new metrics

## 🔐 Security

- Never commit secrets or API keys
- Use environment variables
- Report security issues privately
- Follow OWASP guidelines

## ⚖️ License

By contributing, you agree that contributions are under the MIT License.

## 🤝 Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Constructive feedback only
- Respect others' work

## 📞 Help & Questions

- Open a discussion
- Tag with `question`
- Check existing docs first
- Be clear about your issue

---

**Thank you for contributing!** 🙌
