import IORedis, { RedisOptions } from 'ioredis'
import { ConnectorName, RedisEvent } from '../enums'
import { NoConnection } from '../errors'
import { EventListeners } from '../interfaces'
import { Connector } from './Connector'

export class RedisConnector extends Connector {
    public static readonly defaultOptions = {
        lazyConnect: true,
        commandTimeout: 5000,
        connectTimeout: 5000
    }

	private _connection?: IORedis

	constructor(uri: string, options?: RedisOptions) {
		super(ConnectorName.RedisConnector, uri, options)
	}

	public getConnection(): IORedis {
		if (!this._connection) throw new NoConnection(this.name)
		return this._connection
	}

	/**
	 * @override
	 */
	public setConnectionOptions(options: RedisOptions) {
		this._options = options
	}

	/**
	 * @override
	 */
	public async connect(listeners?: EventListeners): Promise<IORedis> {
        const options = Object.assign({}, RedisConnector.defaultOptions, this._options)
		this._connection = new IORedis(this._uri, options)

        const { onConnected, onDisconnected, onError } = listeners ?? {}
        this._onConnected = onConnected ?? this._onConnected
        this._onError = onError ?? this._onError
        this._onDisconnected = onDisconnected ?? this._onDisconnected

		this._connection.on(RedisEvent.READY, this._onConnected)
		this._connection.on(RedisEvent.ERROR, this._onError)
		this._connection.on(RedisEvent.CLOSE, this._onDisconnected)

        await this._connection.connect()

		return this._connection
	}

	/**
	 * @override
	 */
	public disconnect(): Promise<'OK'> {
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
