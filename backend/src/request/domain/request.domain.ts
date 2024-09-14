export interface RequestDomain {
  id: string;
  agentSlug: string;
  inputData: any;
  status: string;
  processingStartedAt?: Date;
  result?: any;
}
