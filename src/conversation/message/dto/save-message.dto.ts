import { MessageRole } from '../models/MessageRole';

export class SaveMessageDto {
  role: MessageRole;
  content: string;
}
