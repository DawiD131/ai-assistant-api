import { Module } from '@nestjs/common';
import { ActionProcessorService } from './action-processor.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OpenaiService } from '../open-ai/openai.service';

@Module({
  imports: [EventEmitter2],
  providers: [ActionProcessorService, OpenaiService],
})
export class ActionProcessorModule {}
