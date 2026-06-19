import { SecurityFinding, AuditReport, Framework, ComplianceStatus } from './types.js';

export class SecurityAudit {
  private findings: Map<string, SecurityFinding> = new Map();
  private auditReports: AuditReport[] = [];

  createFinding(finding: Omit<SecurityFinding, 'id'>): SecurityFinding {
    const id = `finding-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const fullFinding: SecurityFinding = { id, ...finding };
    this.findings.set(id, fullFinding);
    return fullFinding;
  }

  getFinding(id: string): SecurityFinding | undefined {
    return this.findings.get(id);
  }

  getAllFindings(): SecurityFinding[] {
    return Array.from(this.findings.values());
  }

  getOpenFindings(): SecurityFinding[] {
    return Array.from(this.findings.values()).filter((f) => f.status === 'open');
  }

  resolveFinding(id: string, resolution: string): SecurityFinding | undefined {
    const finding = this.findings.get(id);
    if (!finding) return undefined;

    finding.status = 'resolved';
    finding.evidence.push(`Resolved: ${resolution}`);
    return finding;
  }

  generateAuditReport(
    scope: string,
    framework: Framework,
    complianceStatuses: ComplianceStatus[],
  ): AuditReport {
    const findings = this.getAllFindings();
    const overallScore = this.calculateScore(complianceStatuses);

    const report: AuditReport = {
      reportId: `audit-${Date.now()}`,
      timestamp: new Date(),
      scope,
      framework,
      findings,
      complianceStatus: complianceStatuses,
      overallScore,
      recommendations: this.generateRecommendations(findings, complianceStatuses),
    };

    this.auditReports.push(report);
    return report;
  }

  private calculateScore(statuses: ComplianceStatus[]): number {
    if (statuses.length === 0) return 0;
    const passed = statuses.filter((s) => s.status === 'passed').length;
    const partial = statuses.filter((s) => s.status === 'partial').length;
    return ((passed + partial * 0.5) / statuses.length) * 100;
  }

  private generateRecommendations(
    findings: SecurityFinding[],
    statuses: ComplianceStatus[],
  ): string[] {
    const recommendations: string[] = [];

    // Recommendations based on findings
    const criticalFindings = findings.filter((f) => f.severity === 'critical');
    if (criticalFindings.length > 0) {
      recommendations.push(
        `Address ${criticalFindings.length} critical security findings immediately`,
      );
    }

    // Recommendations based on compliance
    const failedStatuses = statuses.filter((s) => s.status === 'failed');
    if (failedStatuses.length > 0) {
      recommendations.push(
        `Remediate ${failedStatuses.length} failed compliance controls within 30 days`,
      );
    }

    recommendations.push('Implement automated compliance monitoring');
    recommendations.push('Conduct quarterly security awareness training');
    recommendations.push('Perform annual penetration testing');

    return recommendations;
  }

  getAuditHistory(): AuditReport[] {
    return this.auditReports;
  }

  getLatestAuditReport(): AuditReport | undefined {
    return this.auditReports[this.auditReports.length - 1];
  }
}
