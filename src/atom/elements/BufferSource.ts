import Jack from '../Jack'
import ScheduledSource from './ScheduledSource'

class BufferSource extends ScheduledSource<AudioBufferSourceNode, BufferSource.Attributes> {
	/**
	 * Determina de o buffer já foi carregado com um valor não nulo, indicando que o nó deve ser reconstruído na próxima vez que for carregado com um valor não nulo.
	 */
	private alreadyBuffered = false
	/**
	 * Cria um novo nó e atualiza seus atributos.
	 */
	public override refreshNode(): void {
		this.alreadyBuffered = false
		super.refreshNode()
	}
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): AudioBufferSourceNode {
		return this.context!.createBufferSource()
	}
	/**
	 * Estabelece o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected override applyAttribute<$Name extends keyof BufferSource.Attributes>(name: $Name, value: BufferSource.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'start':
				if (node.buffer) {
					super.applyAttribute(name, value)
				}
			break

			case 'buffer':
				if (this.alreadyBuffered && value) {
					return this.reconstruct()
				}

				if (this.attributes.onLoading) {
					this.attributes.onLoading()
				}

				this.decodeAudio(value as ArrayBuffer | undefined, buffer => {
					if (value !== this.attributes.buffer) {
						return
					}

					try {
						// Se já tinha buffer e novo valor é `null`, ou se novo valor não for `null`, o nó deve ser reconstruido em futuras atribuições não nulas.
						if (node.buffer || buffer) {
							this.alreadyBuffered = true
						}

						node.buffer = buffer

						const storedSchedulingAttribute = this.storedSchedulingAttribute

						if (storedSchedulingAttribute) {
							const { when = 0, offset, duration } = storedSchedulingAttribute
							this.startNode(when, offset, duration)
						}
						else if (this.attributes.start === true) {
							this.startNode()
						}

						if (buffer) {
							this.attributes.onLoaded?.(buffer, null)
						}
					}
					catch {
						this.reconstruct()
					}
				}, error => {
					this.attributes.onLoaded?.(null, error)
				})
			break

			case 'loop':
				node.loop = value as boolean ?? false
			break

			case 'loopStart': case 'loopEnd':
				node[name as 'loopStart' | 'loopEnd'] = value as number ?? 0
			break

			case 'detune': case 'playbackRate':
				this.applyParameterization(name, value as Jack.Parameterization)
			break

			case 'onLoading': case 'onLoaded':
				return

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Decodifica o buffer especificado.
	 * @param data Dados a serem decodificados.
	 * @param completionHandler Manipulador de finalização.
	 * @param errorHandler Manipulador de erros.
	 */
	private decodeAudio(data: ArrayBuffer | null | undefined, completionHandler: (buffer: AudioBuffer | null) => void, errorHandler: (error: DOMException) => void): void {
		if (!data) {
			completionHandler(null)
		}
		else { // Precisa ser criada uma cópia do buffer porque o mesmo é invalidado depois de decodificado e não pode ser reutilizado
			this.context!.decodeAudioData(data.slice(0), completionHandler, errorHandler)
		}
	}
}
namespace BufferSource {
	/**
	 * Atributos de `BufferSource`.
	 */
	export interface Attributes extends ScheduledSource.Attributes {
		/**
		 * Um `ArrayBuffer` que será convertido internamente para um {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer `AudioBuffer`} com o áudio a ser reproduzido ou, quando `null`, define um único canal de silêncio (onde toda amostra tem valor 0.0).
		 * @default null
		 */
		buffer?: ArrayBuffer | null
		/**
		 * Parâmetros do tipo {@link https://developer.mozilla.org/en-US/docs/DOM/AudioParam#k-rate k-rate} representando uma dessintonização do playback em {@link http://en.wikipedia.org/wiki/Cent_%28music%29 cents}. Este valor é combinado com `playbackrate` para determinar a velocidade em que o som é reproduzido. Seu alcance nominal é de -∞ até +∞.
		 * @default 0
		 */
		detune?: Jack.Parameterization
		/**
		 * Determina se o áudio deve recomeçar automaticamente quando o `buffer` tiver chegado ao fim.
		 * @default false
		 */
		loop?: boolean
		/**
		 * Valor em segundos definindo para qual ponto o áudio deve retroceder quando `loop` for `true`.
		 * @default 0
		 */
		loopStart?: number
		/**
		 * Valor em segundos definindo quando o áudio deve parar e retroceder para `loopStart` quando `loop` for `true`.
		 * @default 0
		 */
		loopEnd?: number
		/**
		 * Parâmetros do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} que definem o fator de velocidade em que o som será reproduzido (sem correção de pitch), onde 1.0 significa a velocidade original. Este valor é combinado com `detune` para determinar a taxa de playback final.
		 * @default 1
		 */
		playbackRate?: Jack.Parameterization
		/**
		 * Invocando quando iniciar o carregamento do buffer.
		 */
		onLoading?(): void
		/**
		 * Invocado quando finalizar o carregamento do buffer.
		 * @param buffer Buffer de áudio decodificado.
		 * @param error Possível erro.
		 */
		onLoaded?(buffer: AudioBuffer | null, error: DOMException | null): void
	}
}

export default BufferSource
