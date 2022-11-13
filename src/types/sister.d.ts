declare module 'sister' {
  type SisterEventName = string;
  type SisterEventHandler = (...args: any) => void;

  interface SisterEventListener {
    name: SisterEventName;
    handler: SisterEventHandler;
  }

  export default class Sister {
    on(name: SisterEventName, handler: SisterEventHandler): SisterEventListener;
    off(listener: SisterEventListener): void;
    trigger(name: SisterEventName, data: any): void;
  }
}
