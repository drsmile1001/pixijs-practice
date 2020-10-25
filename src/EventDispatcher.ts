export type EventHandler<TPayload> = (payload: TPayload) => any;
export class EventDispatcher<TPayload> {
  private handlers = new Set<EventHandler<TPayload>>();
  public on(handler: EventHandler<TPayload>) {
    this.handlers.add(handler);
  }
  public off(handler: EventHandler<TPayload>) {
    this.handlers.delete(handler);
  }
  public trigger(payload: TPayload) {
    this.handlers.forEach((handler) => {
      new Promise((resolve) => {
        resolve(handler(payload));
      });
    });
  }
}
