import { MessageRole } from '../../conversation/message/models/MessageRole';

export class EntryQueryDto {
  content: string;
  role: MessageRole;
  conversationId?: string;
}
