# KHEPRA

Compliance and security framework for AI platforms with STIG/CCI/NIST mappings and post-quantum cryptography.

## Overview

**KHEPRA** provides automated compliance tracking, security auditing, and cryptographic operations for the AI platform:

- **STIG Controls** — DoD Security Technical Implementation Guides
- **CCI Requirements** — Common Compliance Index mapping
- **NIST-800-53** — NIST Security and Privacy Controls
- **Post-Quantum Crypto** — SHA3-256, ML-DSA-65 ready

## Quick Start

```typescript
import { ComplianceFramework, SecurityAudit, CryptoProvider } from 'khepra';

// Compliance tracking
const compliance = new ComplianceFramework();
compliance.markCompliant('AC-2', 'NIST-800-53', ['evidence-1', 'evidence-2']);
const score = compliance.getComplianceScore('NIST-800-53');

// Security auditing
const audit = new SecurityAudit();
const finding = audit.createFinding({
  title: 'Weak password policy',
  description: 'Passwords not enforcing complexity',
  severity: 'high',
  component: 'Auth Service',
  discoveredAt: new Date(),
  status: 'open',
  relatedControls: ['AC-2', 'IA-5'],
  remediation: 'Enforce 14-char minimum with mixed case',
  evidence: ['Finding from audit scan'],
});

// Cryptography (post-quantum ready)
const hash = CryptoProvider.hashSHA3('data');
const token = CryptoProvider.generateToken(32);
const auditHash = CryptoProvider.generateAuditHash(
  'login',
  new Date(),
  'user@example.com',
  'api-key-123',
);
```

## Features

### Compliance Frameworks

| Framework | Controls | Purpose |
|-----------|----------|---------|
| **STIG** | 250+ rules | DoD security baselines |
| **CCI** | 1000+ items | Common requirement index |
| **NIST-800-53** | 180+ controls | Federal security baseline |
| **NIST-800-171** | 110+ controls | Cybersecurity for contractors |

### Compliance Tracking

- Check status of any control
- Mark as passed/failed/partial
- Track evidence and remediation
- Calculate compliance scores
- Generate audit reports

### Security Auditing

- Document security findings with severity levels
- Track remediation status and timeline
- Link findings to compliance controls
- Generate audit reports with recommendations
- Audit history and trending

### Cryptography (Post-Quantum)

- **SHA3-256** — hash function (256-bit, post-quantum resistant)
- **AES-256-GCM** — encryption (256-bit authenticated)
- **PBKDF2-HMAC-SHA3** — key derivation (password-based)
- **ML-DSA-65** — digital signatures (future: post-quantum standard)
- **Audit chaining** — immutable event proof

## API Reference

### ComplianceFramework

```typescript
// Check compliance
const status = compliance.checkCompliance('AC-2', 'NIST-800-53');

// Mark compliant
compliance.markCompliant('AC-2', 'NIST-800-53', ['evidence1', 'evidence2']);

// Mark non-compliant
compliance.markNonCompliant(
  'AC-2',
  'NIST-800-53',
  'Update password policy',
  new Date('2024-08-01'),
);

// Get score
const { score, passed, failed, partial } = compliance.getComplianceScore('NIST-800-53');

// Map between frameworks
const cciReqs = compliance.mapSTIGToCCI('SV-223898r717641_rule');
const nistControls = compliance.mapCCIToNIST('CCI-000192');
```

### SecurityAudit

```typescript
// Create finding
const finding = audit.createFinding({
  title: '...',
  description: '...',
  severity: 'high',
  component: '...',
  discoveredAt: new Date(),
  status: 'open',
  relatedControls: ['AC-2'],
  remediation: '...',
  evidence: [],
});

// Get findings
const allFindings = audit.getAllFindings();
const openFindings = audit.getOpenFindings();

// Resolve finding
audit.resolveFinding(finding.id, 'Patched and verified');

// Generate report
const report = audit.generateAuditReport('API Service', 'NIST-800-53', statuses);
```

### CryptoProvider

```typescript
// Hashing
const hash = CryptoProvider.hashSHA3('data');

// Random token generation
const token = CryptoProvider.generateToken(32);

// Integrity verification
const signature = CryptoProvider.hashSHA3(data + secret);
const verified = CryptoProvider.verifyIntegrity(data, signature, secret);

// Key derivation
const salt = CryptoProvider.generateRandomBytes(16);
const key = CryptoProvider.deriveKey(password, salt, 100000);

// Audit chaining
const hash1 = CryptoProvider.generateAuditHash('login', now, 'user1', 'api-1');
const hash2 = CryptoProvider.chainAuditHashes(hash1, 'logout');
```

## Compliance Report Example

```json
{
  "reportId": "audit-1719907200000",
  "timestamp": "2024-07-02T12:00:00Z",
  "scope": "API Service",
  "framework": "NIST-800-53",
  "findings": [
    {
      "id": "finding-123",
      "title": "Weak password policy",
      "severity": "high",
      "status": "open"
    }
  ],
  "complianceStatus": [
    {
      "controlId": "AC-2",
      "framework": "NIST-800-53",
      "status": "failed",
      "dueDate": "2024-08-01"
    }
  ],
  "overallScore": 72.5,
  "recommendations": [
    "Address 1 critical security findings immediately",
    "Remediate 3 failed compliance controls within 30 days",
    "Implement automated compliance monitoring"
  ]
}
```

## Post-Quantum Cryptography

KHEPRA is **ML-DSA-65 ready** — the NIST-standardized post-quantum digital signature algorithm scheduled for production use in Node.js crypto module.

Current support:
- SHA3-256 (post-quantum resistant hash)
- PBKDF2-HMAC-SHA3 (post-quantum resistant KDF)
- ML-DSA-65 integration ready (waiting for Node.js 21+)

## Integration with Platform

KHEPRA integrates with:

- **9Router** — track compliance of model routing decisions
- **Aria Agent** — audit tool execution and API calls
- **OpenMono** — secure local inference validation
- **Fractera** — compliance dashboard and reporting

## Regulations Supported

- 🇺🇸 FedRAMP (Federal Risk and Authorization Management Program)
- 🇺🇸 FISMA (Federal Information Security Modernization Act)
- 🇪🇺 GDPR (General Data Protection Regulation)
- 🇪🇺 NIS2 (Network and Information Security Directive)
- 🇦🇺 ASD ISM (Australian Government Information Security Manual)

## Security Considerations

- All hashes use SHA3-256 (post-quantum resistant)
- Cryptographic operations use constant-time comparisons
- Audit chain prevents tampering and deletion
- Private keys never logged or exposed
- All compliance evidence is immutable

## Roadmap

- Automated STIG scanning
- SCAP data stream integration
- Real-time compliance monitoring
- Compliance trends and forecasting
- Integration with external audit tools (Tenable, Qualys)
- ML-DSA-65 support (Node.js 21+)
- Full post-quantum migration path

## License

MIT
