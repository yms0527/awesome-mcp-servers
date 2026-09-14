# Contributing to TimezoneToolkit

Thank you for considering contributing to TimezoneToolkit! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the [Issues](https://github.com/Cicatriiz/timezone-toolkit/issues)
- If not, create a new issue with a descriptive title and clear description
- Include steps to reproduce the bug, expected behavior, and actual behavior
- Add screenshots if applicable
- Specify your operating system, Node.js version, and Claude Desktop version

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the [Issues](https://github.com/Cicatriiz/timezone-toolkit/issues)
- If not, create a new issue with a descriptive title and clear description
- Explain why this enhancement would be useful to most users
- Provide examples of how the enhancement would work

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

1. Clone your fork of the repository
2. Install dependencies with `npm install`
3. Build the project with `npm run build`
4. Run tests with `npm run test-tools`

## Coding Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation when necessary
- Write tests for new features

## Adding New Tools

When adding a new tool to TimezoneToolkit:

1. Create a new function in the appropriate service file
2. Add the tool definition to the ListTools handler in index.ts
3. Add the tool implementation to the CallTool handler in index.ts
4. Add tests for the new tool in test-tools.ts
5. Update the README.md with documentation for the new tool

## Testing

- Run `npm run test-tools` to test all tools
- Ensure all tests pass before submitting a Pull Request
- Add new tests for new features or bug fixes

## Documentation

- Update the README.md when adding new features
- Keep examples up-to-date
- Document any breaking changes

## Questions?

If you have any questions about contributing, please open an issue or contact the maintainer at thedawg100@gmail.com.

Thank you for contributing to TimezoneToolkit!
