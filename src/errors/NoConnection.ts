export class NoConnection extends Error {
	constructor(connector: string) {
        const message = `No connection of ${connector} has been established yet`
        super(message)
    }
}
