export interface RequestDomain {
  id: string;
  userId: string;
  agentSlug: string;
  sessionId: string;
  inputData: any;
  status: string;
  processingStartedAt?: Date;
  result?: any;
}
