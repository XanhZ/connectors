import { ConnectorFactory } from '../src'

const uri = 'redis://localhost:6379/0'

async function run() {
    const connector = ConnectorFactory.createRedisConnector(uri)

    try {
        await connector.connect()
    } catch (error) {
        console.error(error)
    } finally {
        setTimeout(async () => {
            connector.disconnect()
                .catch(error => {
                    console.error(error)
                    process.exit(1)
                })
        }, 5000)
    }
}

run()
