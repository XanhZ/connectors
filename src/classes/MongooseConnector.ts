import fs from 'fs/promises'
import { Connection, ConnectOptions, createConnection } from 'mongoose'
import Path from 'path'
import { ConnectorName, MongooseEvent } from '../enums'
import { ModelNotFound, NoConnection } from '../errors'
import { EventListeners } from '../interfaces'
import { Connector } from './Connector'

export class MongooseConnector extends Connector {
	private _schemaDir: string
	private _connection?: Connection

	constructor(uri: string, schemaDir: string, options?: ConnectOptions) {
		super(ConnectorName.MongooseConnector, uri, options)
		this._schemaDir = schemaDir
	}

	public getConnection(): Connection {
		if (!this._connection) throw new NoConnection(this.name)
		return this._connection
	}

	public getModel(name: string) {
		if (!this._connection) throw new NoConnection(this.name)
		const Model = this._connection.models[name]
		if (!Model) throw new ModelNotFound(name)
		return Model
	}

	/**
	 * @override
	 */
	public setConnectionOptions(options: ConnectOptions) {
		super.setConnectionOptions(options ?? {})
	}

	/**
	 * @override
	 */
	public async connect(listeners?: EventListeners): Promise<Connection> {
		const _conn = createConnection(this._uri, this._options)
        
        const { onConnected, onDisconnected, onError } = listeners ?? {}
        this._onConnected = onConnected ?? this._onConnected
        this._onError = onError ?? this._onError
        this._onDisconnected = onDisconnected ?? this._onDisconnected


		_conn.on(MongooseEvent.CONNECTED, this._onConnected)
		_conn.on(MongooseEvent.ERROR, this._onError)
		_conn.on(MongooseEvent.CLOSE, this._onDisconnected)

		const [connection, schemaFiles] = await Promise.all([_conn.asPromise(), fs.readdir(this._schemaDir)])

		schemaFiles.forEach(fileName => {
			const filePath = Path.join(this._schemaDir, fileName)
			const Schema = require(filePath)
			connection.model(fileName, Schema)
		})

		this._connection = connection

		return connection
	}

	/**
	 * @override
	 */
	public disconnect(): Promise<void> {
		if (!this._connection) throw new NoConnection(this.name)
		return this._connection.close()
	}

	/**
	 * @override
	 */
	public async reload(): Promise<void> {
		throw new Error('Method not implemented.')
	}
}
