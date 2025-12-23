import { Attachment } from './attachment.type';

export interface Step {
  id: number;
  order: number;
  description: string;
  attachments: Attachment[];
}
