import Element from './Element'
import Event from '../../toolkit/Event'
import QueuedBatchRunner from '../../toolkit/QueuedBatchRunner'
import Jack from '../Jack'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode `AudioScheduledSourceNode`}.
 */
abstract class ScheduledSource<$Node extends AudioScheduledSourceNode, $Attributes extends ScheduledSource.Attributes> extends Element<$Node, $Attributes>{
	/**
	 * Determina se a fonte de áudio já foi iniciada, indicando que o nó deve ser reconstruído na próxima vez que o valor mudar.
	 */
	private alreadyStarted = false
	/**
	 * Hashs usados em `QueuedBatchRunner`.
	 */
	private batchIDs = {
		/**
		 * Hash utilizado em `setAttribute`.
		 */
		startAttribute: Math.random(),
		/**
		 * Hash utilizado em `startNode`.
		 */
		startNode: Math.random(),
	}
	/**
	 * Armazenamento do agendamento corrente.
	 */
	protected get storedSchedulingAttribute(): ScheduledSource.Scheduling.Stored | undefined {
		let scheduling = this.attributes.start
		let typeofScheduling = typeof scheduling

		if (typeofScheduling === 'function') {
			scheduling = (scheduling as ScheduledSource.Scheduling.Functional)(this.context!)
			typeofScheduling === typeof scheduling
		}

		switch (typeofScheduling) {
			case 'number':                    return { when: scheduling as number }
			case 'undefined': case 'boolean': return undefined
			default:                          return scheduling as ScheduledSource.Scheduling.Stored
		}
	}
	/**
	 * Cria e retorna um novo nó.
	 */
	public refreshNode(): void {
		this.alreadyStarted = false
		super.refreshNode()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof $Attributes>(name: $Name, value: $Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'start': {
				QueuedBatchRunner.run([ScheduledSource, this, this.batchIDs.startAttribute], () => {
					const context = this.context

					if (!context) {
						return
					}

					const currentTime = context.currentTime
					const storedSchedulingAttribute = this.storedSchedulingAttribute
					let typeofValue = typeof value

					if (typeofValue === 'function') {
						value = (value as any)(context)
						typeofValue = typeof value
					}

					if (typeofValue === 'boolean') {
						if (value) {
							!this.alreadyStarted ? this.startNode() : this.reconstruct()
						}
						else if (this.alreadyStarted) {
							node.stop()
						}
					}
					else if (typeofValue === 'number') {
						if (!this.alreadyStarted) {
							this.startNode(value as any)
						}
						else if (value as any !== storedSchedulingAttribute?.when) {
							this.reconstruct()
						}
					}
					else {
						const scheduling = value as any as ScheduledSource.Scheduling.Stored
						const cachedScheduling = storedSchedulingAttribute

						if (!this.alreadyStarted) {
							this.startNode(scheduling.when, scheduling.offset, scheduling.duration)
						}
						else if (!cachedScheduling ||
							scheduling.when > currentTime ||
							scheduling.offset !== (currentTime - scheduling.when) ||
							cachedScheduling.duration !== scheduling.duration
						) {
							this.reconstruct()
						}
					}
				})
			}break

			case 'onEnded': {
				this.updateEventListener('ended', value, this.attributes.onEnded)
			}break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Inicia a execução da fonte de áudio.
	 * @param when Instante em segundos em que a fonte de áudio deverá começar.
	 * @param offset Offset em segundos indicando a posição inicial do buffer da fonte de áudio.
	 * @param duration Determina por quanto tempo (em segundos) a fonte de áudio deverá executar.
	 */
	protected startNode(when?: number, offset?: number, duration?: number): void {
		QueuedBatchRunner.run([ScheduledSource, this, this.batchIDs.startNode], () => {
			if (!this.alreadyStarted) {
				this.alreadyStarted = true
				// @ts-ignore - Apenas `BufferSource` usa os 2 últimos argumentos - ocorre erro ao tentar sobrescrever com uma propriedade contravariante
				this.node?.start(when, offset, duration)
			}
		})
	}
}
namespace ScheduledSource {
	/**
		 * Atributos comuns a todas as fontes de áudio.
		 */
	export interface Attributes extends Element.Attributes.Audio {
		start: number | boolean | Scheduling | Jack.ContextFC<number | boolean | Scheduling>
		/**
		 * Invocado quando a fonte de áudio parar de tocar, seja porque parou em um ponto pré-determinado, a duração total do áudio foi executada, ou porque o buffer inteiro foi executado.
		 * @param event Evento associado.
		 */
		onEnded?(this: AudioScheduledSourceNode, event: Event<AudioScheduledSourceNode>): void
	}
	/**
	 * Representa um agendamento de execução da fonte de áudio.
	 */
	export type Scheduling = (
		number | boolean | Scheduling.Stored | Scheduling.Functional
	)
	export namespace Scheduling {
		/**
		 * Agendamento armazenado.
		 */
		export interface Stored {
			/**
			 * Instante em segundos em que a fonte de áudio deverá começar.
			 */
			when: number
			/**
			 * Offset em segundos indicando a posição inicial do buffer da fonte de áudio.
			 */
			offset?: number
			/**
			 * Determina por quanto tempo (em segundos) a fonte de áudio deverá executar.
			 */
			duration?: number
		}
		/**
		 * Agendamento funcional.
		 */
		export type Functional = Jack.ContextFC<Stored>
	}
}

export default ScheduledSource
