import { connect, Connection, Options as AMQPOptions } from 'amqplib'
import { ConnectorName, RabbitMQEvent } from '../enums'
import { NoConnection } from '../errors'
import { EventListeners } from '../interfaces'
import { Connector } from './Connector'

export class RabbitMQConnector extends Connector {
	private _connection?: Connection

	constructor(uri: string, options?: AMQPOptions.Connect) {
		super(ConnectorName.RabbitMQConnector, uri, options)
	}

	public getConnection(): Connection {
		if (!this._connection) throw new NoConnection(this.name)
		return this._connection
	}

	/**
	 * @override
	 */
	public setConnectionOptions(options: AMQPOptions.Connect) {
		super.setConnectionOptions(options ?? {})
	}

	/**
	 * @override
	 */
	public connect(listeners?: EventListeners): Promise<Connection> {
        const { onConnected, onDisconnected, onError } = listeners ?? {}
		this._onConnected = onConnected ?? this._onConnected
		this._onError = onError ?? this._onError
		this._onDisconnected = onDisconnected ?? this._onDisconnected

        this.addListener(RabbitMQEvent.CONNECTED, this._onConnected)
        this.addListener(RabbitMQEvent.ERROR, this._onError)

        return new Promise((resolve, reject) => {
            const url = this._uri
            const options = this._options
            connect(url || options)
                .then(connection => {
                    this.emitEvent(RabbitMQEvent.CONNECTED)
                    this._connection = connection
                    this._connection.on(RabbitMQEvent.ERROR, this._onError)
                    this._connection.on(RabbitMQEvent.CLOSE, this._onDisconnected)
                    resolve(connection)
                })
                .catch(error => {
                    this.emitEvent(RabbitMQEvent.ERROR, error)
                    reject(error)
                })
        })
	}

    /**
     * @override 
     */
	public disconnect() {
        if (!this._connection) throw new NoConnection(this.name)
        return this._connection.close()
	}
    
    /**
     * @override 
     */
	public reload() {
		throw new Error('Method not implemented.')
	}
}
