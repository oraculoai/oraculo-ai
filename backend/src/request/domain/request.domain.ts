export interface RequestDomain {
  id: string;
  inputData: any;
  status: string;
  processingStartedAt?: Date;
  result?: any;
}
