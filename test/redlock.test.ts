import { ConnectorFactory } from '../src'

const uri = 'redis://localhost:6379/0'

async function run() {
    const connector = ConnectorFactory.createRedlockConnector(uri)

    try {
        await connector.connect()
        const redlock = connector.getConnection()
        const lock = await redlock.acquire(["test"], 3000)
        console.log('Locking...')
        const result = await redlock.release(lock)
        console.log(result)
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
