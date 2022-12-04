import { MongooseConnector } from './MongooseConnector'
import { RabbitMQConnector } from './RabbitMQConnector'
import { RedisConnector } from './RedisConnector'
import { RedlockConnector } from './RedlockConnector'
import { ConnectOptions } from 'mongoose'
import { RedisOptions } from 'ioredis'
import { Settings as RedlockOptions } from 'redlock'
import { Options as AMQPOptions } from 'amqplib'

export class ConnectorFactory {
	public static createMongooseConnector(uri: string, schemaDir: string, options?: ConnectOptions): MongooseConnector {
		return new MongooseConnector(uri, schemaDir, options)
	}

	public static createRabbitMQConnector(uri: string, options?: AMQPOptions.Connect): RabbitMQConnector {
        return new RabbitMQConnector(uri, options)
    }

	public static createRedisConnector(uri: string, options?: RedisOptions): RedisConnector {
		return new RedisConnector(uri, options)
	}

	public static createRedlockConnector(
		uri: string,
		redlockOptions?: RedlockOptions,
		redisOptions?: RedisOptions
	): RedlockConnector {
		return new RedlockConnector(uri, redlockOptions, redisOptions)
	}
}
