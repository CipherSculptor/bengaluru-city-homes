# Branching Strategy for Bengaluru City Homes

This document outlines the branching strategy for the Bengaluru City Homes project to ensure smooth development and deployment processes.

## Branch Structure

The repository follows a simplified Git Flow approach with the following branches:

### Main Branches

- **main**: The production branch that contains the stable, released code. This branch is deployed to production.
- **development**: The integration branch where features are merged before being released to production.

### Supporting Branches

- **feature/[feature-name]**: Feature branches for developing new features or enhancements.
- **bugfix/[bug-name]**: Branches for fixing bugs.
- **hotfix/[hotfix-name]**: Branches for critical fixes that need to be applied directly to production.

## Workflow

### Feature Development

1. Create a new feature branch from `development`:
   ```
   git checkout development
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Develop your feature, making regular commits:
   ```
   git add .
   git commit -m "Descriptive commit message"
   ```

3. Push your feature branch to GitHub:
   ```
   git push origin feature/your-feature-name
   ```

4. When the feature is complete, create a Pull Request to merge into `development`.

5. After code review and approval, merge the feature into `development`.

### Bug Fixes

1. Create a bugfix branch from `development`:
   ```
   git checkout development
   git pull
   git checkout -b bugfix/bug-description
   ```

2. Fix the bug and commit your changes:
   ```
   git add .
   git commit -m "Fix: Description of the bug fix"
   ```

3. Push your bugfix branch and create a Pull Request to `development`.

### Hotfixes

For critical issues that need immediate attention in production:

1. Create a hotfix branch from `main`:
   ```
   git checkout main
   git pull
   git checkout -b hotfix/critical-issue
   ```

2. Fix the issue and commit your changes:
   ```
   git add .
   git commit -m "Hotfix: Description of the critical fix"
   ```

3. Push your hotfix branch and create Pull Requests to both `main` and `development`.

### Releases

When ready to release a new version:

1. Merge `development` into `main`:
   ```
   git checkout main
   git pull
   git merge development
   git push origin main
   ```

2. Tag the release:
   ```
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

## Best Practices

1. **Keep branches up to date**: Regularly pull changes from the parent branch.
2. **Write descriptive commit messages**: Clearly explain what changes were made and why.
3. **Create focused branches**: Each branch should address a single feature or fix.
4. **Delete branches after merging**: Clean up branches that have been merged.
5. **Use Pull Requests**: All changes should go through Pull Requests for code review.
6. **Test before merging**: Ensure all tests pass before merging into `development` or `main`.

By following this branching strategy, we can maintain a clean, organized codebase and ensure smooth development and deployment processes.
