import Scenario from './Scenario'
import Event from '../toolkit/Event'
import { willSet } from '../toolkit/Decoration'
/**
 * Módulo que representa um cenário online (que usa `AudioContext`) com contexto de áudio único que será instanciado e propagado para os módulos filhos.
 */
class Scene extends Scenario<Scene.Attributes> {
	/**
	 * Construtor do contexto de áudio.
	 */
	public static readonly AudioContext = window.AudioContext || (window as any).webkitAudioContext as AudioContext
	/**
	 * Contexto de áudio.
	 */
	@willSet(function(this: Scene, newValue: AudioContext) {
		if (newValue !== this.context) {
			try { // As vezes o GB fecha antes, causando uma exceção.
				this.context?.close()
			}
			catch {}
		}
	})
	public readonly context!: AudioContext
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof Scene.Attributes> {
		return ['latencyHint', 'sampleRate']
	}
	/**
	 * Construtor.
	 * @param attributes Atributos da cena.
	 */
	constructor(attributes: Scene.Attributes) {
		super(attributes)
		this.context.suspend()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Scene.Attributes>(name: $Name, value: Scene.Attributes[$Name]): void {
		switch (name) {
			case 'onStateChange':
				this.updateEventListener('statechange', value, this.attributes.onStateChange)
			break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Atualiza a execução do contexto de áudio.
	 */
	protected updateContextExecution() {
		const context = this.context

		if (context) {
			this.stage && this.active ? context.resume() : context.suspend()
		}
	}
	/**
	 * Cria um novo contexto e atualiza seus atributos.
	 */
	protected refreshNode(): void {
		(this.context as any) = new Scene.AudioContext(this.attributes)
		super.refreshNode()
	}
}
namespace Scene {
	/**
	 * Atributos de `Scene`.
	 */
	export interface Attributes extends Scenario.Attributes {
		/**
		 * Latência de saída de áudio. Este valor pode ou não ser usado. Verifique {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency `AudioContext.baseLatency`} para saber o valor verdadeiro.
		 * @default LatencyCategory.INTERACTIVE
		 */
		latencyHint?: LatencyCategory | number
		/**
		 * Invocado quando o estado do contexto de áudio muda devido à chamada de um dos métodos de mudança de estado ({@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/suspend `AudioContext.suspend`}, {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume `AudioContext.resume`} ou {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close `AudioContext.close`}).
		 * @param this Contexto de áudio.
		 * @param event Evento associado.
		 */
		onStateChange?(this: AudioContext, event: Event<AudioContext>): void
	}
	/**
	 * Representa uma categoria de latência.
	 */
	export const enum LatencyCategory {
		/**
		 * Determina que a latência de saída do áudio e o consumo de energia devem ser balanceados.
		 */
		BALANCED = 'balanced',
		/**
		 * Determina que a latência deve ser a mínima possível para que não haja glitches em resposta à interação do usuário. Isso requer mais consumo de energia.
		 */
		INTERACTIVE = 'interactive',
		/**
		 * Determina que o consumo de energia deve ser minimizado às custas de uma latência mais alta. Útil para sons não-interativos.
		 */
		PLAYBACK = 'playback',
	}
}

export default Scene
