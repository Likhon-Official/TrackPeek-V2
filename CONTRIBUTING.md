# Contributing to TrackPeek

First off, thank you for considering contributing to TrackPeek! It's people like you that make TrackPeek such a great educational tool for cybersecurity awareness.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and educational environment. By participating, you are expected to uphold this standard.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setup Development Environment

1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/TrackPeek-V1.git
   cd TrackPeek-V1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

- Use functional components with hooks
- Implement proper error handling
- Ensure responsive design
- Add proper TypeScript types
- Follow the existing file structure

### Testing

- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test responsive design on different screen sizes
- Verify all permissions work correctly
- Test error scenarios

### Commit Messages

Use clear and meaningful commit messages:

```
feat: add new fingerprinting technique
fix: resolve camera permission issue
docs: update installation instructions
style: improve responsive design
refactor: optimize performance monitoring
```

## Project Structure

```
src/
├── components/          # React components
│   ├── FingerprintScanner.tsx
│   ├── PermissionScanner.tsx
│   ├── NetworkScanner.tsx
│   ├── SystemScanner.tsx
│   ├── LoadingScreen.tsx
│   ├── MatrixRain.tsx
│   └── SkeletonLoader.tsx
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
├── index.css          # Global styles and animations
└── vite-env.d.ts      # TypeScript declarations
```

## Adding New Features

### New Scanner Module

1. Create a new component in `src/components/`
2. Follow the existing scanner pattern
3. Add proper TypeScript interfaces
4. Implement responsive design
5. Add to the main scanner options in `App.tsx`

### New Fingerprinting Technique

1. Research the technique thoroughly
2. Implement with proper error handling
3. Add user consent mechanisms
4. Document the privacy implications
5. Test across different browsers

## Security Considerations

When contributing:

- Ensure all data collection is client-side only
- Implement proper permission requests
- Add clear user consent mechanisms
- Document privacy implications
- Test security boundaries

## Documentation

- Update README.md for new features
- Add inline code comments
- Update TypeScript interfaces
- Document any new dependencies

## Questions?

Don't hesitate to ask questions by creating an issue with the "question" label.

## Recognition

Contributors will be recognized in the project documentation and release notes.

Thank you for contributing to TrackPeek! 🚀