import type { Rectangle } from "../common";

export type EventType = keyof HTMLElementEventMap;
export type EventHandler<T extends Event> = (event: T) => void;

export class ThrottleHtmlManipulator {
  animationFrameHandle = 0;
  eventListeners = new Map<string, EventHandler<Event>>();
  events = new Map<string, Event>();
  elementRect: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
  resizeObserver: ResizeObserver;

  constructor(protected readonly element: HTMLElement) {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const { x, y } = element.getBoundingClientRect();
        this.elementRect = { x, y, width, height };
      }
    });
    const { x, y, width, height } = element.getBoundingClientRect();
    this.elementRect = { x, y, width, height };

    this.requestProcessEvents();
  }

  dispose() {
    this.resizeObserver.unobserve(this.element);
    this.resizeObserver.disconnect();
    for (const [key, _] of this.eventListeners) {
      this.element.removeEventListener(key, this.onEventTriggered);
    }

    cancelAnimationFrame(this.animationFrameHandle);
  }

  protected registerEvent<T extends Event>(type: EventType, handler: EventHandler<T>, options?: { passive?: boolean }) {
    this.element.addEventListener(type, this.onEventTriggered, options);
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
