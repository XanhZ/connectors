export enum ConnectorName {
	MongooseConnector = 'MongooseConnector',
	RabbitMQConnector = 'RabbitMQConnector',
	RedisConnector = 'RedisConnector',
	RedlockConnector = 'RedlockConnector',
}

export enum MongooseEvent {
	CONNECTING = 'connecting',
    CONNECTED = 'connected',
    OPEN = 'open',
    DISCONNECTING = 'disconnecting',
    DISCONNECTED = 'disconnected',
    CLOSE = 'close',
    RECONNECTED = 'reconnected',
    ERROR = 'error'
}

export enum RedisEvent {
    CONNECT = 'connect',
    READY = 'ready',
    ERROR = 'error',
    CLOSE = 'close',
    RECONNECTING = 'reconnecting',
    END = 'end',
    WAIT = 'wait'
}

export enum RedlockEvent {
    CONNECT = 'connect',
    READY = 'ready',
    ERROR = 'error',
    CLOSE = 'close',
    RECONNECTING = 'reconnecting',
    END = 'end',
    WAIT = 'wait',
    CLIENT_ERROR = 'clientError'
}

export enum RabbitMQEvent {
    CONNECTED = 'connected',
    ERROR = 'error',
    CLOSE = 'close',
    RECONNECTING = 'reconnecting',
}
