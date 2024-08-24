export interface MessageDomain {
  id: string;
  from: 'agent' | 'user';
  text: string;
}
