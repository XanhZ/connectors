import { Listener } from '../types'

export interface EventListeners {
	onConnected: Listener
    onDisconnected: Listener
    onError: Listener
}
