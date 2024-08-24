export interface ChatMessage {
  id?: string;
  from: 'agent' | 'user';
  text: string;
  status: 'sending' | 'sent';
}
