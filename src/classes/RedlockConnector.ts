import IORedis, { RedisOptions } from 'ioredis'
import Redlock from 'redlock'
import { Settings as RedlockOptions } from 'redlock'
import { ConnectorName, RedlockEvent } from '../enums'
import { NoConnection } from '../errors'
import { EventListeners } from '../interfaces'
import { Connector } from './Connector'

export class RedlockConnector extends Connector {
	private _connection?: Redlock
	private _redisOptions: RedisOptions = {
        lazyConnect: true,
        commandTimeout: 5000,
        connectTimeout: 5000
    }

	constructor(uri: string, redlockOptions?: RedlockOptions, redisOptions?: RedisOptions) {
		super(ConnectorName.RedlockConnector, uri, redlockOptions)
		Object.assign(this._redisOptions, redisOptions)
	}

	public getConnection(): Redlock {
		if (!this._connection) throw new NoConnection(this.name)
		return this._connection
	}

	/**
	 * @override
	 */
	public setConnectionOptions(options: RedlockOptions) {
		super.setConnectionOptions(options ?? {})
	}

	/**
	 * @override
	 */
	public async connect(listeners?: EventListeners): Promise<Redlock> {
		const client = new IORedis(this._uri, this._redisOptions as RedisOptions)

		const { onConnected, onDisconnected, onError } = listeners ?? {}
		this._onConnected = onConnected ?? this._onConnected
		this._onError = onError ?? this._onError
		this._onDisconnected = onDisconnected ?? this._onDisconnected

		client.on(RedlockEvent.READY, this._onConnected)
		client.on(RedlockEvent.ERROR, this._onError)
		client.on(RedlockEvent.CLOSE, this._onDisconnected)

		await client.connect()

		this._connection = new Redlock([client], this._options)
		this._connection.on(RedlockEvent.CLIENT_ERROR, this._onError)

		return this._connection
	}

	/**
	 * @override
	 */
	public disconnect(): Promise<void> {
		if (!this._connection) throw new NoConnection(this.name)
		return this._connection.quit()
	}

	/**
	 * @override
	 */
	public reload(): Promise<any> {
		throw new Error('Method not implemented.')
	}
}
