import { ChatMessage } from '../../../../../shared/network/client/chatMessage.js'
import { Component } from '../../../../../shared/component/Component.js'
import { Entity } from '../../../../../shared/entity/Entity.js'

// This event is triggered when a chat message is sent
// Added to the chat entity
export class ChatMessageEvent extends Component {
  constructor(entityId: number, public sender: string, public content: string) {
    super(entityId)
  }
}