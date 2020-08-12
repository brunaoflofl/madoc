export interface Message {
  type: string;
  message: string;
  error?: Error;
}
