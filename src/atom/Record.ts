import QueuedBatchRunner from '../toolkit/QueuedBatchRunner'
import Scenario from './Scenario'
/**
 * Módulo que representa um cenário offline (que usa `OfflineAudioContext`) com contexto de áudio único que será instanciado e propagado para os módulos filhos.
 */
class Record extends Scenario<Record.Attributes> {
	/**
	 * Construtor do contexto de áudio.
	 */
	public static readonly AudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext as OfflineAudioContext
	/**
	 * Contexto de áudio.
	 */
	public readonly context!: OfflineAudioContext
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof Record.Attributes> {
		return ['numberOfChannels', 'length']
	}
	/**
	 * Suspensões correntemente agendadas.
	 */
	private scheduledSuspensions = new Set<number>()
	/**
	 * Determina se o contexto de áudio já iniciou, indicando que o mesmo deve ser reconstruído quando o valor mudar.
	 */
	private started = false
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Record.Attributes>(name: $Name, value: Record.Attributes[$Name]): void {
		switch (name) {
			case 'suspension':
				if (value) {
					const { when } = value as unknown as Record.Suspension
					const times = Array.isArray(when) && when || [when]

					for (const time of times) {
						if (!this.scheduledSuspensions.has(time)) {
							this.scheduledSuspensions.add(time)

							this.context!.suspend(time).then(() => {
								this.scheduledSuspensions.delete(time)

								const currentSuspension = this.attributes.suspension
								const currentWhen = currentSuspension?.when
								const currentTimes = currentWhen ? (Array.isArray(currentWhen) && currentWhen || [currentWhen]) : undefined

								if (currentTimes?.includes(time)) {
									currentSuspension!.handler(this.context)
								}
								else {
									this.context.resume()
								}
							})
						}
					}
				}
			break

			case 'onComplete':
				this.updateEventListener('complete', value, this.attributes.onComplete)
			break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Atualiza a execução do contexto de áudio.
	 */
	protected updateContextExecution(): void {
		QueuedBatchRunner.run([Record, this], () => {
			const context = this.context

			if (this.stage && this.active) {
				if (!this.started) {
					this.started = true
					context.startRendering()
				}
				else {
					context.resume()
				}
			}
			else {
				context.suspend(context.currentTime + 0.000_1).then(() => {
					if (this.active) {
						context.resume()
					}
				}).catch(error => console.warn(error))
			}
		})
	}
	/**
	 * Cria um novo nó e atualiza seus atributos.
	 */
	protected refreshNode(): void {
		const attributes = this.attributes
		const sampleRate = attributes.sampleRate || 44100
		const length = (attributes.length || 1) * sampleRate
		;(this.context as any) = new Record.AudioContext({ ...attributes, length, sampleRate })

		super.refreshNode()
	}
}
namespace Record {
	/**
	 * Representa uma suspensão em ou mais instantes de tempos agendados.
	 */
	export interface Suspension {
		/**
		 * Instante(s) em que o contexto de áudio deverá ser suspenso.
		 */
		when: number | number[]
		/**
		 * Manipular invocado em cada suspensão.
		 * @param context Contexto de áudio.
		 */
		handler(context: OfflineAudioContext): void
	}
	/**
	 * Atributos de `Record`.
	 */
	export interface Attributes extends Scenario.Attributes {
		/**
		 * Duração do buffer, em segundos (o valor é multiplicado por `sampleRate`).
		 * @default 1
		 */
		length?: number
		/**
		 * Número de canais.
		 */
		numberOfChannels?: number
		/**
		 * Suspensão.
		 */
		suspension?: Suspension
		/**
		 * Invocado após completar o processamento da cena.
		 * @param this Contexto de áudio.
		 * @param event Evento associado.
		 */
		onComplete?(this: OfflineAudioContext, event: OfflineAudioCompletionEvent): void
	}
}

export default Record
