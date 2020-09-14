import Jack from './Jack'
import Module from './Module'
import Element from './elements/Element'
import Stage from './Stage'
import { didSet } from '../toolkit/Decoration'
/**
 * Representa um grapho de áudio, online ou offline. É responsável por criar as instâncias de `BaseAudioContext`. Todo módulo precisa ser filho direto ou indireto de `Scenario`.
 */
abstract class Scenario<$Attributes extends Scenario.Attributes> extends Jack<BaseAudioContext, $Attributes> {
	/**
	 * A instância de `Stage` da qual o cenário faz parte.
	 */
	@didSet(function (this: Scenario<any>) {
		this.updateContextExecution()
	})
	public stage?: Stage
	/**
	 * Contexto de áudio redefinido com acesso público à leitura.
	 */
	@didSet(function (this: Scenario<any>) {
		(this.node as any) = this.context
		this.updateContextExecution()
	})
	public readonly context!: BaseAudioContext
	/**
	 * Determina se o contexto de áudio está ou não executando.
	 */
	@didSet(function (this: Scenario<any>) {
		if (this.context) {
			this.updateContextExecution()
		}
	})
	public active?: boolean
	/**
	 * Entradas inerentes vazias. Um cenário deve ser filho direto de um `Stage`.
	 */
	protected get innerInputs(): Set<AudioNode> {
		return Module.EMPTY_SET
	}
	/**
	 * Saídas inerentes vazias. Um cenário deve ser filho direto de um `Stage`.
	 */
	protected get innerOutputs(): Set<AudioNode> {
		return Module.EMPTY_SET
	}
	/**
	 * Construtor.
	 * @param attributes Atributos da cena.
	 */
	constructor(attributes: $Attributes) {
		super(attributes)
		this.refreshNode()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof $Attributes>(name: $Name, value: $Attributes[$Name]): void {
		switch (name) {
			case 'active':
				this.active = value as $Attributes['active'] ?? true
			break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Aplica uma parametrização no atributo com o nome especificado.
	 * @param key Nome da propriedade paramétrica.
	 * @param parameterization Parametrização a ser aplicada.
	 * TODO: Implementar.
	 */
	protected applyParameterization(_key: string, _parameterization?: Jack.Parameterization): void {
		throw new Error('Not implemented.')
	}
	/**
	 * Atualiza o manipulador para os eventos do tipo `type`, removendo o antigo manipulador caso seja especificado.
	 * @param type Tipo do evento.
	 * @param newListener Manipulador a ser adicionado.
	 * @param oldListener Manipulador a ser removido.
	 */
	protected updateEventListener(type: string, newListener?: any, oldListener?: any): void {
		Module.updateEventListener(this.context, type, newListener, oldListener)
	}
	/**
	 * Atualiza a execução do contexto de áudio.
	 */
	protected abstract updateContextExecution(): void
}
namespace Scenario {
	/**
	 * Representa a posição e orientação da única pessoa que escuta a cena de áudio, e é usado em {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialisation_basics espcaialização de áudio}.
	 */
	export interface Listener {
		/**
		 * Representa a posição horizontal do ouvinte em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		positionX?: Jack.Parameterization
		/**
		 * representa a posição vertical do ouvinte em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		positionY?: Jack.Parameterization
		/**
		 * Representa a posição longitudinal do ouvinte em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		positionZ?: Jack.Parameterization
		/**
		 * Representa a posição horizontal da direção frontal do ouvinte (direção em que ele está olhando) em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		forwardX?: Jack.Parameterization
		/**
		 * Representa a posição vertical da direção frontal do ouvinte (direção em que ele está olhando) em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		forwardY?: Jack.Parameterization
		/**
		 * Representa a posição longitudinal da direção frontal do ouvinte (direção em que ele está olhando) em um sistema de coordenadas cartesianas.
		 * @default -1
		 */
		forwardZ?: Jack.Parameterization
		/**
		 * Representa a posição horizontal do topo da cabeça do ouvinte em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		upX?: Jack.Parameterization
		/**
		 * Representa a posição vertical do topo da cabeça do ouvinte em um sistema de coordenadas cartesianas.
		 * @default 1
		 */
		upY?: Jack.Parameterization
		/**
		 * Representa a posição longitudinal do topo da cabeça do ouvinte em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		upZ?: Jack.Parameterization
	}
	/**
	 * Representa um destino final de um grapho de áudio em um dado contexto.
	 */
	export interface Destination extends Element.Attributes.Audio {
		/**
		 * Define a quantidade máxima de canais que o dispositivo físico pode manipular.
		 */
		maxChannelCount?: number
	}
	/**
	 * Atributos de `Scenario`.
	 */
	export interface Attributes extends Module.Attributes {
		/**
		 * Determina se o contexto de áudio está ou não executando.
		 */
		active?: boolean
		/**
		 * Taxa de amostragem.
		 * @default 44100
		 */
		sampleRate?: number
		/**
		 * Ouvinte único da cena.
		 */
		listener?: Listener
		/**
		 * Destino final do grapho de áudio.
		 */
		destination?: Destination
	}
}

export default Scenario