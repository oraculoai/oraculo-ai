export interface RequestStatusDomain {
  id: string;
  agentSlug: string;
  status: string;
  processingStartedAt?: Date;
  artifactId: string | null;
}
