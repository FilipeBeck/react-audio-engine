/**
 * Executor memorizado em fila. Despacha a execução para o próximo loop de eventos e evita execução duplicada quando o hash não mudar e a execução agendada ainda não tiver sido realizada.
 */
class QueuedMemoizedRunner {
	/**
	 * Usa um fallback para `setTimeout` caso não haja suporte para `setImmediate`.
	 */
	public static setImmediate: (...args: any[]) => any = (typeof setImmediate !== undefined) && setImmediate || setTimeout
	/**
	 * Promessa da execução correntemente agendada.
	 */
	private queuedPromise: Promise<any> | null = null
	/**
	 * Hash de execução.
	 */
	private hash: any = null
	/**
	 * Agenda a execução do manipulador especificado para o próximo loop de eventos.
	 * @param hash Hash de execução. Chamadas subsequentes para esse método antes do próximo loop de eventos serão ignoradas se o hash for o mesmo.
	 * @param handler Manipulador de execução.
	 */
	public async run(hash: any, handler: QueuedMemoizedRunner.Handler): Promise<void> {
		if (hash !== this.hash) {
			this.hash = hash
			this.queuedPromise = new Promise<any>((resolve, reject) => {
				QueuedMemoizedRunner.setImmediate(() => {
					this.queuedPromise = this.hash = null

					try {
						resolve(handler())
					}
					catch (error) {
						reject(error)
					}
				})
			})
		}

		return this.queuedPromise
	}
}
namespace QueuedMemoizedRunner {
	/**
	 * Manipulador de execução.
	 */
	export type Handler = () => any
}

export default QueuedMemoizedRunner