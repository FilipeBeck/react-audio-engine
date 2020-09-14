/**
 * Redefine `Event` nativo de forma genérica.
 */
class Event<$Target extends Event.Target<any>> extends globalThis.Event {
	/**
	 * Returns the object whose event listener's callback is currently being invoked.
	 */
	readonly currentTarget!: $Target | null
	/** @deprecated */
	readonly srcElement!: $Target | null
	/**
     * Returns the object to which event is dispatched (its target).
     */
	readonly target!: $Target
	/**
     * Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.
     */
	public composedPath!: () => $Target[]
}
namespace Event {
	export class Target<$Event extends Event<any>> extends EventTarget {
		public addEventListener(type: string, listener: Event.ListenerOrListenerObject<$Event> | null, options?: boolean | AddEventListenerOptions): void {
			super.addEventListener(type, listener, options)
		}
    /**
     * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
     */
		public dispatchEvent(event: $Event): boolean {
			return super.dispatchEvent(event)
		}
    /**
     * Removes the event listener in target's event listener list with the same type, callback, and options.
     */
		public removeEventListener(type: string, callback: Event.ListenerOrListenerObject<$Event> | null, options?: EventListenerOptions | boolean): void {
			super.removeEventListener(type, callback, options)
		}
	}
	/**
	 * Versão genérica de `EventListener` nativo.
	 */
	export interface Listener<$Event extends Event<any>> extends EventListener {
		(event: $Event): void
	}
	/**
	 * Versão genérica de `EventListenerObject` nativo.
	 */
	export interface ListenerObject<$Event extends Event<any>> extends EventListenerObject {
		handleEvent(event: $Event): void
	}
	/**
	 * Versão genérica de `EventListenerOrEventListenerObject` nativo.
	 */
	export type ListenerOrListenerObject<$Event extends Event<any>> = Listener<$Event> | ListenerObject<$Event>
}

export default Event