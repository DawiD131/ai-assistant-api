import { Module } from '@nestjs/common';
import { ActionProcessorService } from './action-processor.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  providers: [ActionProcessorService, EventEmitter2],
})
export class ActionProcessorModule {}
