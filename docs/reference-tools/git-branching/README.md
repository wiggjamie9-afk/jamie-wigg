# Git Branching Strategies for Multi-Environment DevOps

AWS Prescriptive Guidance: Git Branching Strategy for Multi-Account DevOps

## Overview

Choosing the right Git branching strategy helps teams coordinate development across multiple environments (sandbox, dev, test, staging, production) and cloud accounts. This guide presents three proven strategies with visual diagrams and implementation guidance.

**Problem Solved:** Teams working across multiple environments often struggle with:
- How to promote code safely from dev → staging → prod
- When to branch, when to merge
- How to handle hotfixes in production
- Keeping teams aligned on a single model

**Solution:** Pick one strategy, implement consistently, and document it. All three work — the choice depends on your release cadence and team size.

## Three Core Strategies

### Strategy 1: Trunk-Based Development

**Best for:** Continuous deployment, high-frequency releases, small teams

#### How It Works
```
main (trunk)
├── feature/user-auth
│   └── [short-lived, reviewed, merged same day]
├── feature/api-gateway
│   └── [short-lived, reviewed, merged same day]
└── production
    └── [tagged release pointing to main commit]
```

#### Principles
1. **Single source of truth:** `main` branch is always deployable
2. **Short-lived branches:** Feature branches exist for 1-2 days max
3. **Frequent merges:** Multiple PRs/day keep main updated
4. **Continuous deployment:** `main` → test → staging → prod automatically
5. **Feature flags:** Incomplete features hidden behind toggles

#### Process
```
1. Create feature branch from main
   git checkout -b feature/user-auth

2. Commit frequently (daily)
   git push origin feature/user-auth

3. Open PR, get code review
4. Merge to main immediately after approval
   git merge feature/user-auth
   git push origin main

5. CI/CD pipeline:
   main commit → test → staging → production
   (automatic, no manual gates)
```

#### Deployment Flow
```
Trunk (main)
   ↓
Automated Test Env
   ↓
Staging Env
   ↓
Production Env
```

#### Advantages
✅ Simplest model  
✅ Minimal merge conflicts  
✅ Fastest time-to-production  
✅ Clear single source of truth  

#### Disadvantages
❌ Requires discipline (no long branches)  
❌ Feature flags overhead  
❌ Can't easily release "select features"  
❌ Needs robust CI/CD

#### Best For
- SaaS products with daily deploys
- Microservices architectures
- Teams with 5-20 engineers
- High-confidence test coverage

---

### Strategy 2: GitHub Flow

**Best for:** Pull request culture, code review emphasis, simpler than Gitflow

#### How It Works
```
main (production-ready)
├── feature/user-auth
│   └── [PR reviewed, tested, merged]
├── feature/api-gateway
│   └── [PR reviewed, tested, merged]
├── hotfix/security-patch
│   └── [urgent PR, fast-tracked]
└── release (manual gates)
```

#### Principles
1. **Always deployable main:** main = production code
2. **Feature branches:** One per feature, deleted after merge
3. **Pull Request culture:** All changes via PR with reviews
4. **Testing before merge:** CI must pass, code review required
5. **Manual release trigger:** Human decides when to deploy

#### Process
```
1. Create feature branch
   git checkout -b feature/user-auth

2. Make commits, push regularly
   git push origin feature/user-auth

3. Open PR when ready
   - Describe what changed and why
   - Reference any linked issues

4. Peer review (mandatory)
   - At least 1 approval required
   - Changes requested? Iterate

5. Merge after approval + CI passing
   - Optional: squash commit
   git merge feature/user-auth
   
6. Delete feature branch
   git push origin --delete feature/user-auth

7. Manual deployment decision
   git tag -a v1.2.3 -m "Release 1.2.3"
   git push origin v1.2.3
   → Deploy tagged version to production
```

#### Deployment Flow
```
Feature PR
   ↓
Code Review + CI Pass
   ↓
Merge to main
   ↓
Manual Release Trigger
   ↓
Production Deployment
```

#### Advantages
✅ Strong code review culture  
✅ Clear feature tracking (one PR = one feature)  
✅ Easy to explain & learn  
✅ Good for distributed teams  
✅ Flexible release timing  

#### Disadvantages
❌ Slower than trunk-based (review overhead)  
❌ Release coordination needed (who triggers deploys?)  
❌ Can delay important fixes  

#### Best For
- Open source projects
- Teams valuing code review
- Medium release frequency (weekly/bi-weekly)
- Remote-first teams

---

### Strategy 3: Gitflow (Release Branching)

**Best for:** Scheduled releases, multiple in-flight features, long release cycles

#### How It Works
```
develop (integration branch)
├── feature/user-auth
│   └── merged to develop
├── feature/api-gateway
│   └── merged to develop
├── release/v1.2.0
│   ├── bug fixes only
│   └── merged to main + back to develop
├── hotfix/security-patch
│   ├── urgent production fix
│   └── merged to main + develop
└── main (production)
    ├── v1.0.0
    ├── v1.1.0
    ├── v1.2.0 (released)
    └── tagged releases
```

#### Principles
1. **main = production code** (tagged releases only)
2. **develop = integration branch** (where features merge)
3. **Feature branches** from develop, merged back
4. **Release branches** for final testing & bug fixes
5. **Hotfix branches** for urgent production fixes

#### Process

##### Feature Development
```
1. Create feature from develop
   git checkout -b feature/user-auth develop

2. Work on feature
   [make commits]
   git push origin feature/user-auth

3. When complete, create PR to develop
   - Code review
   - CI tests pass

4. Merge to develop, delete feature branch
   git merge feature/user-auth develop
```

##### Release Preparation
```
1. When ready to release, create release branch
   git checkout -b release/v1.2.0 develop

2. Bump version numbers, update changelog
   [commit changes]

3. Only bug fixes on release branch
   [fix critical issues]

4. Final QA testing on release branch

5. Merge to main with tag
   git checkout main
   git merge --no-ff release/v1.2.0
   git tag -a v1.2.0

6. Merge back to develop
   git checkout develop
   git merge --no-ff release/v1.2.0

7. Delete release branch
   git branch -d release/v1.2.0
```

##### Hotfix (Emergency Production Fix)
```
1. Create hotfix from main
   git checkout -b hotfix/security-patch main

2. Fix the bug
   [commit fix]

3. Merge to main with tag
   git checkout main
   git merge --no-ff hotfix/security-patch
   git tag -a v1.1.1

4. Merge back to develop
   git checkout develop
   git merge --no-ff hotfix/security-patch

5. Delete hotfix branch
   git branch -d hotfix/security-patch
```

#### Deployment Flow
```
Features on develop
   ↓
Create release/v1.2.0 branch
   ↓
Testing & bugfixes on release
   ↓
Merge to main, tag v1.2.0
   ↓
Deploy production
```

#### Advantages
✅ Clear feature organization  
✅ Separate development from releases  
✅ Good for planned releases  
✅ Easy hotfix management  
✅ Multiple in-flight features work well  

#### Disadvantages
❌ Most complex to learn  
❌ More branches to manage  
❌ Not suitable for continuous deployment  
❌ Overhead for small teams  

#### Best For
- Software with scheduled releases (quarterly, annually)
- Teams with 10-50+ engineers
- Products needing stability (banking, healthcare)
- Complex feature integration

---

## Comparison Matrix

| Feature | Trunk | GitHub Flow | Gitflow |
|---------|-------|-------------|---------|
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Deploy Frequency** | Daily | Weekly | Monthly+ |
| **Merge Conflicts** | Minimal | Low | Medium |
| **Code Review** | Optional | Mandatory | Mandatory |
| **Team Size** | 5-20 | 5-50 | 20-500 |
| **Learning Curve** | Easiest | Easy | Hard |
| **Hotfix Capability** | Feature flags | Feature branch | Hotfix branch |
| **Feature Isolation** | Feature flags | Branch | Feature branch |

## Multi-Environment Promotion

All three strategies support multi-environment promotion:

```
Local Development
   ↓ (commit & push)
Sandbox/Dev Environment
   ↓ (automated tests)
Test Environment
   ↓ (QA testing)
Staging Environment
   ↓ (production-like)
Production Environment
   ↓ (live traffic)
```

### Environment Mapping

#### Trunk-Based
```
main commit → Automated progression through envs
sandbox → dev → test → staging → prod
(every push)
```

#### GitHub Flow
```
Merge to main → Manual release trigger
sandbox → dev → test → staging
         → Manual → prod
```

#### Gitflow
```
release/vX.Y.Z → Test/Staging testing
             → main tag vX.Y.Z → Production
                 ↓
            develop continues features
```

## Implementation Checklist

### Choose Your Strategy
- [ ] Team reads the three options
- [ ] Discuss release frequency & team size
- [ ] Document choice in team handbook
- [ ] Add to onboarding for new hires

### Setup Branches
- [ ] Create main branch (or use existing)
- [ ] For Gitflow: Create develop branch
- [ ] Set branch protection rules
- [ ] Configure CI/CD triggers

### Configure CI/CD
- [ ] Tests run on all PRs
- [ ] Linting/formatting checks enabled
- [ ] Auto-deployment pipeline (if applicable)
- [ ] Status checks required before merge

### Documentation
- [ ] Create CONTRIBUTING.md
- [ ] Document branch naming conventions
- [ ] Create release checklist
- [ ] Add hotfix procedure

### Training
- [ ] Walk through an example feature with team
- [ ] Create video tutorial
- [ ] Document common scenarios (hotfix, merge conflict)
- [ ] Set up office hours for questions

## Common Scenarios

### Scenario 1: Urgent Security Hotfix

**Trunk:** Feature flag to control rollback  
**GitHub Flow:** Create hotfix branch, fast-track PR  
**Gitflow:** Create hotfix/security branch from main

### Scenario 2: Multiple Teams Working in Parallel

**Trunk:** Feature flags isolate work  
**GitHub Flow:** Separate feature branches  
**Gitflow:** Separate feature branches + develop branch

### Scenario 3: Release Candidates Testing

**Trunk:** Tag commit for testing  
**GitHub Flow:** Manual release branch  
**Gitflow:** release/vX.Y.Z for final QA

## Tools & Automation

### Git GUIs
- GitHub Desktop (free)
- GitKraken (paid)
- SourceTree (free)
- VS Code Git Graph extension

### Automation
- GitHub Actions (workflows, auto-merge, status checks)
- GitLab CI/CD (similar to Actions)
- Jenkins (complex, self-hosted)
- AWS CodePipeline (AWS-native)

### Best Practices
```
Branch Naming:
- feature/user-auth
- bugfix/login-issue
- release/v1.2.0
- hotfix/security-patch

Commit Messages:
- [TICKET-123] Add user authentication
- [BUGFIX] Fix null pointer in parser
- Capitalize first letter
- Reference issue numbers
```

## Resources

- **Official Docs:**
  - GitHub Flow Guide: https://guides.github.com/introduction/flow/
  - Gitflow by Vincent Driessen: https://nvie.com/posts/a-successful-git-branching-model/
  - Trunk-Based Development: https://trunkbaseddevelopment.com/

- **AWS Guides:**
  - Choosing a Git Branching Strategy: [AWS docs]
  - Implementing Trunk Strategy: [AWS prescriptive guidance]
  - Implementing GitHub Flow: [AWS prescriptive guidance]
  - Implementing Gitflow: [AWS prescriptive guidance]

---

## Integration with Your YouTube Shorts Pipeline

**Recommendation:** GitHub Flow

Why:
- ✅ Code review for all shorts (quality control)
- ✅ Clear feature tracking (one video = one feature)
- ✅ Easy hotfix for corrected videos
- ✅ Good team communication via PRs

Example:
```
main (approved videos)
├── feature/adhd-video-6 (in review)
├── feature/adhd-video-7 (in development)
└── hotfix/adhd-video-5-correction (urgent fix)

Process:
1. Create feature/adhd-video-6 branch
2. Generate script, narration, thumbnail
3. Push to branch
4. Create PR with video preview
5. Review (thumbnail, script quality, metadata)
6. Approve & merge to main
7. Automated upload to YouTube
```

---

**Useful for:** Team coordination, multi-environment deployment, release management.

**Not needed for:** Solo projects or simple scripts (just use main).
