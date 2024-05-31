import { ComponentWrapper } from '../component/events/ComponentWrapper.js'
import { Component } from '../component/Component.js'
import { ComponentAddedEvent } from '../component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '../component/events/ComponentRemovedEvent.js'

import { Entity } from '../entity/Entity.js'
import { EventQueue } from '../entity/EventQueue.js'
import { NetworkDataComponent } from '../network/NetworkDataComponent.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { EventListComponent } from '../../shared/component/events/EventListComponent.js'

/* See https://gamedev.stackexchange.com/a/194135 */
export class BaseEventSystem {
  private static instance: BaseEventSystem
  eventQueue: EventQueue

  private constructor() {
    this.eventQueue = new EventQueue()
  }

  /**
   * Singleton pattern to get the instance of BaseEventSystem
   */
  static getInstance(): BaseEventSystem {
    if (!BaseEventSystem.instance) {
      BaseEventSystem.instance = new BaseEventSystem()
    }
    return BaseEventSystem.instance
  }

  /**
   * Called after the update loop to clean up processed events
   * @param entities Array of entities to process
   */
  afterUpdate(entities: Entity[]) {
    this.cleanProcessedEvents()
  }

  /**
   * Add an event to the event queue
   * @param event The event component to add
   */
  static addEvent(event: Component) {
    const eventQueueEntity = BaseEventSystem.getInstance().eventQueue.entity
    if (!eventQueueEntity) {
      console.error('EventQueue entity not found')
      return
    }

    const eventListComponent = eventQueueEntity.getComponent(EventListComponent)
    if (!eventListComponent) {
      console.error('EventListComponent not found on the EventQueue entity')
      return
    }

    eventListComponent.addEvent(event)
  }

  /**
   * Add a network event to the event queue
   * Also add the event to the NetworkDataComponent so it can be sent to the client and replicated
   * @param event  The network event component to add
   */
  static addNetworkEvent(event: NetworkComponent) {
    const eventQueueEntity = BaseEventSystem.getInstance().eventQueue.entity
    if (!eventQueueEntity) {
      console.error('EventQueue entity not found')
      return
    }

    BaseEventSystem.addEvent(event)

    const networkDataComponent = eventQueueEntity.getComponent(NetworkDataComponent)
    if (!networkDataComponent) {
      console.error('NetworkDataComponent not found on the EventQueue entity')
      return
    }

    console.log('Adding network event', event)
    networkDataComponent.addComponent(event)
  }

  /**
   * Remove all processed events from the event queue
   */
  private cleanProcessedEvents() {
    // Removing all events from the event queue
    this.eventQueue.entity.getComponent(EventListComponent)?.removeAllEvents()

    // Removing the network event components from the NetworkDataComponent, they have been sent to the client
    this.eventQueue.entity.getComponent(NetworkDataComponent)?.removeAllComponents()

    // TODO: Check if asynchronous events are processed correctly (ChatMessageEvent, etc.)
  }

  /**
   * Get all components from the event queue entity
   * @returns Array of components
   */
  static getAllEvents() {
    return BaseEventSystem.getInstance().eventQueue.entity.components
  }

  /**
   * Get events of a specific type from the event queue
   * @param componentType The type of the event component to get
   * @returns Array of event components of the specified type
   */
  static getEvents<T extends Component>(componentType: new (...args: any[]) => T): T[] {
    const eventListComponent =
      BaseEventSystem.getInstance().eventQueue.entity.getComponent(EventListComponent)!
    return eventListComponent.getEvents(componentType)
  }

  /**
   * Get events wrapped by a specific component wrapper type
   * @param eventType The type of the event wrapper component (e.g., ComponentAddedEvent, ComponentRemovedEvent, etc.)
   * @param componentType The type of the wrapped event component
   * @returns Array of wrapped event components
   * @example
   * ```typescript
   *  BaseEventSystem.getEventsWrapped(ComponentAddedEvent, ChatMessageComponent)
   *  BaseEventSystem.getEventsWrapped(ComponentRemovedEvent, ChatMessageComponent)
   * ```
   */
  static getEventsWrapped<E extends ComponentWrapper<T>, T extends Component>(
    eventType: new (...args: any[]) => E,
    componentType: new (...args: any[]) => T
  ): E[] {
    // Filtering by eventType (e.g., ComponentAddedEvent)
    const events = BaseEventSystem.getEvents(eventType)
    // Then filtering by its wrapped component type
    return events.filter((event) => event.component instanceof componentType) as E[]
  }

  /**
   * Handle component added event
   * @param addedComponent The component that was added
   */
  static onComponentAdded<T extends Component>(addedComponent: T) {
    BaseEventSystem.addEvent(new ComponentAddedEvent(addedComponent))
  }

  /**
   * Handle component removed event
   * @param removedComponent The component that was removed
   */
  static onComponentRemoved<T extends Component>(removedComponent: T) {
    BaseEventSystem.addEvent(new ComponentRemovedEvent(removedComponent))
  }
}