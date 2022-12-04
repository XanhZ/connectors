import { ConnectorFactory } from '../src'
import schemaDir from './db'

const uri = 'mongodb://localhost:27017/test'

async function run() {
    const connector = ConnectorFactory.createMongooseConnector(uri, schemaDir)

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
