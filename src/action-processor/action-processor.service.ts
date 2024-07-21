import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ActionProcessorService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent('entry.action')
  async selectTool() {
    this.eventEmitter.emit('entry.answer', 'HEY');
  }
}
