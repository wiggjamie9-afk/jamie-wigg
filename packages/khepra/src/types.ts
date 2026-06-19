export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ComplianceLevel = 'passed' | 'failed' | 'partial' | 'not-applicable';
export type Framework = 'STIG' | 'CCI' | 'NIST-800-53' | 'NIST-800-171';

export interface STIGControl {
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  remediation: string;
  checkContent: string;
}

export interface CCIRequirement {
  cciId: string;
  description: string;
  type: 'system' | 'application' | 'operational';
  relatedControls: string[];
}

export interface NISTControl {
  controlId: string;
  title: string;
  description: string;
  statement: string;
  supplementalGuidance: string;
  relatedControls: string[];
}

export interface ComplianceStatus {
  controlId: string;
  framework: Framework;
  status: ComplianceLevel;
  lastChecked: Date;
  evidence: string[];
  remediation?: string;
  dueDate?: Date;
}

export interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  component: string;
  discoveredAt: Date;
  status: 'open' | 'in-progress' | 'resolved';
  relatedControls: string[];
  remediation: string;
  evidence: string[];
}

export interface AuditReport {
  reportId: string;
  timestamp: Date;
  scope: string;
  framework: Framework;
  findings: SecurityFinding[];
  complianceStatus: ComplianceStatus[];
  overallScore: number;
  recommendations: string[];
}
