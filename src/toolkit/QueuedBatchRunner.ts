import QueuedMemoizedRunner from './QueuedMemoizedRunner'
/**
 * Executor memorizado em lote. Despacha a execução de um conjunto de manipuladores para o próximo loop de eventos. Usado para otimizar e evitar múltiplos eventos na fila.
 */
namespace QueuedBatchRunner {
	/**
	 * Manipulador de execução.
	 */
	type Handler = QueuedMemoizedRunner.Handler
	/**
	 * Mapa de manipuladores de execução.
	 */
	type HandlerMap = Map<any, Handler | HandlerMap>
	/**
	 * Instância única de `QueuedMemoizedRunner`.
	 */
	const memoizedRunner = new QueuedMemoizedRunner()
	/**
	 * Instância do mapa de manipuladores.
	 */
	const handlerMap: HandlerMap = new Map()
	/**
	 * Retorna o último mapa que contenha os manipuladores.
	 * @param hashs Hashs a serem percorridos.
	 */
	function getLastMap(hashs: any[]): Map<any, Handler> {
		let iterator = handlerMap

		for (const hash of hashs) {
			let map = iterator.get(hash)

			if (!map) {
				iterator.set(hash, map = new Map())
			}
			else if (typeof map === 'function') {
				throw new Error()
			}

			iterator = map
		}

		return iterator as Map<any, Handler>
	}
	/**
	 * Percorre o mapa de manipuladores, extraindo todos eles em um array.
	 */
	function getAllHandlers(): Handler[] {
		const handlers = Array<Handler>()

		function extract(map: HandlerMap): void {
			for (const [_hash, value] of map) {
				if (typeof value === 'function') {
					handlers.push(value)
				}
				else {
					extract(value)
				}
			}
		}

		extract(handlerMap)

		return handlers
	}
	/**
	 * Agenda a execução do manipulador especificado para o próximo loop de eventos.
	 * @param hashs Hashs de execução. Chamadas subsequentes para esse método antes do próximo loop de eventos serão ignoradas se os hashs forem os mesmos ou se `memoize` for `false`.
	 * @param handler Manipulador de execução.
	 * @param memoize Determina se deve reatribuir o manipulador memos que os hashs não mudem.
	 */
	export function run(hashs: any[], handler: () => any, memoize?: boolean): void {
		const hash = hashs.pop()
		const handlers = getLastMap(hashs)

		if (!handlers.get(hash) || memoize !== true) {
			handlers.set(hash, handler)
		}

		memoizedRunner.run(QueuedBatchRunner, () => {
			const handlers = getAllHandlers()
			handlerMap.clear()

			for (const handler of handlers) {
				handler()
			}
		})
	}
}

export default QueuedBatchRunner
