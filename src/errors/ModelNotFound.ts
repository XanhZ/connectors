export class ModelNotFound extends Error {
	constructor(modelName: string) {
		const message = `Model ${modelName} not found`
		super(message)
	}
}
