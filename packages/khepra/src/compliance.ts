import {
  Framework,
  STIGControl,
  CCIRequirement,
  NISTControl,
  ComplianceStatus,
  ComplianceLevel,
} from './types.js';

export class ComplianceFramework {
  private stigControls: Map<string, STIGControl> = new Map();
  private cciRequirements: Map<string, CCIRequirement> = new Map();
  private nistControls: Map<string, NISTControl> = new Map();
  private complianceStatuses: Map<string, ComplianceStatus> = new Map();

  constructor() {
    this.initializeControls();
  }

  private initializeControls() {
    // Sample STIG controls
    this.stigControls.set('SV-223898r717641_rule', {
      ruleId: 'SV-223898r717641_rule',
      title: 'System must enforce password complexity',
      description: 'The system must enforce password complexity requirements',
      severity: 'high',
      category: 'Authentication',
      remediation: 'Configure password policy to require minimum 14 characters with mixed case',
      checkContent: 'Verify password policy requirements in system settings',
    });

    // Sample CCI requirements
    this.cciRequirements.set('CCI-000192', {
      cciId: 'CCI-000192',
      description: 'The information system enforces approved authorizations',
      type: 'system',
      relatedControls: ['AC-2', 'AC-3', 'AC-5'],
    });

    // Sample NIST controls
    this.nistControls.set('AC-2', {
      controlId: 'AC-2',
      title: 'Account Management',
      description: 'The organization manages information system accounts',
      statement: 'The organization manages information system accounts...',
      supplementalGuidance: 'Guidance for implementing AC-2...',
      relatedControls: ['AT-1', 'AU-2', 'AU-6'],
    });
  }

  getSTIGControl(ruleId: string): STIGControl | undefined {
    return this.stigControls.get(ruleId);
  }

  getCCIRequirement(cciId: string): CCIRequirement | undefined {
    return this.cciRequirements.get(cciId);
  }

  getNISTControl(controlId: string): NISTControl | undefined {
    return this.nistControls.get(controlId);
  }

  checkCompliance(controlId: string, framework: Framework): ComplianceStatus {
    const key = `${framework}:${controlId}`;
    let status = this.complianceStatuses.get(key);

    if (!status) {
      // Default to partial compliance for unknown controls
      status = {
        controlId,
        framework,
        status: 'partial',
        lastChecked: new Date(),
        evidence: [],
      };
      this.complianceStatuses.set(key, status);
    }

    return status;
  }

  markCompliant(
    controlId: string,
    framework: Framework,
    evidence: string[],
  ): ComplianceStatus {
    const key = `${framework}:${controlId}`;
    const status: ComplianceStatus = {
      controlId,
      framework,
      status: 'passed',
      lastChecked: new Date(),
      evidence,
    };
    this.complianceStatuses.set(key, status);
    return status;
  }

  markNonCompliant(
    controlId: string,
    framework: Framework,
    remediation: string,
    dueDate: Date,
  ): ComplianceStatus {
    const key = `${framework}:${controlId}`;
    const status: ComplianceStatus = {
      controlId,
      framework,
      status: 'failed',
      lastChecked: new Date(),
      evidence: [],
      remediation,
      dueDate,
    };
    this.complianceStatuses.set(key, status);
    return status;
  }

  getComplianceScore(framework: Framework): {
    score: number;
    passed: number;
    failed: number;
    partial: number;
  } {
    const statuses = Array.from(this.complianceStatuses.values()).filter(
      (s) => s.framework === framework,
    );

    const passed = statuses.filter((s) => s.status === 'passed').length;
    const failed = statuses.filter((s) => s.status === 'failed').length;
    const partial = statuses.filter((s) => s.status === 'partial').length;

    const score =
      statuses.length > 0
        ? ((passed + partial * 0.5) / statuses.length) * 100
        : 0;

    return { score, passed, failed, partial };
  }

  getAllStatuses(): ComplianceStatus[] {
    return Array.from(this.complianceStatuses.values());
  }

  getStatuses(framework: Framework): ComplianceStatus[] {
    return Array.from(this.complianceStatuses.values()).filter(
      (s) => s.framework === framework,
    );
  }

  mapSTIGToCCI(stigRuleId: string): CCIRequirement[] {
    // In production, this would use a comprehensive mapping database
    const stigControl = this.stigControls.get(stigRuleId);
    if (!stigControl) return [];

    // Return matching CCI requirements
    return Array.from(this.cciRequirements.values());
  }

  mapCCIToNIST(cciId: string): NISTControl[] {
    const cciReq = this.cciRequirements.get(cciId);
    if (!cciReq) return [];

    return cciReq.relatedControls
      .map((controlId) => this.nistControls.get(controlId))
      .filter((c) => c !== undefined) as NISTControl[];
  }
}
