import { ConnectorFactory } from '../src'

const uri = 'amqp://localhost:5672'

async function run() {
    const connector = ConnectorFactory.createRabbitMQConnector(uri)

    await connector.connect()

    setTimeout(() => {
        connector.disconnect()
            .then(() => process.exit(0))
            .catch(error => {
                console.error(error)
                process.exit(1)
            })
    }, 5000)
}

run()