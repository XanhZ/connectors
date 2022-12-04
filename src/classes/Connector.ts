import EventEmitter from 'events'
import { Listener } from '../types'
import { EventListeners } from '../interfaces'

export abstract class Connector {
	public readonly name: string
	protected _uri: string
	protected _options: object
	protected _events: EventEmitter
	protected _onConnected: Listener
	protected _onError: Listener
	protected _onDisconnected: Listener

	constructor(name: string, uri: string, options?: object) {
		this.name = name
		this._events = new EventEmitter()
		this._uri = uri
		this._options = options ?? {}
		this._onConnected = () => {
			console.log(`[${this.name}]: Connected on ${uri}`)
		}
		this._onError = (error: Error) => {
			console.error(`[${this.name}]: Error on ${uri}`, error)
		}
		this._onDisconnected = () => {
			console.log(`[${this.name}]: Disconnected on ${uri}`)
		}
	}

	public emitEvent(event: string, ...args: any[]) {
		return this._events.emit(event, args)
	}

	public addListener(event: string, listener: (...args: any[]) => void) {
		this._events.on(event, listener)
	}

	public setURI(uri: string) {
		this._uri = uri
	}

	public setConnectionOptions(options: object) {
		this._options = options
	}

	public abstract connect(listeners?: EventListeners): any

	public abstract disconnect(): any

	public abstract reload(): any
}
