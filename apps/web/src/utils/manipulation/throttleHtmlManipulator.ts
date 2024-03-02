export type EventType = keyof HTMLElementEventMap;
export type EventHandler<T extends Event> = (event: T) => void;

export class ThrottleHtmlManipulator {
  animationFrameHandle = 0;
  eventListeners = new Map<string, EventHandler<Event>>();
  events = new Map<string, Event>();

  constructor(protected readonly element: HTMLElement) {
    this.requestProcessEvents();
  }

  dispose() {
    this.eventListeners.forEach((_, key) =>
      this.element.removeEventListener(key, this.onEventTriggered)
    );

    cancelAnimationFrame(this.animationFrameHandle);
  }

  protected registerEvent<T extends Event>(
    type: EventType,
    handler: EventHandler<T>
  ) {
    this.element.addEventListener(type, this.onEventTriggered);
    this.eventListeners.set(type, handler as EventHandler<Event>);
  }

  private onEventTriggered = (event: Event) => {
    this.events.set(event.type, event);
  };

  private processEventsLoop = () => {
    this.events.forEach((value, key) => {
      const handler = this.eventListeners.get(key);
      handler?.(value);
    });
    this.events.clear();

    this.requestProcessEvents();
  };

  private requestProcessEvents() {
    this.animationFrameHandle = requestAnimationFrame(this.processEventsLoop);
  }
}

