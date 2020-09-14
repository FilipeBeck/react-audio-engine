import Jack from '../Jack'
import Module from '../Module'
import { didSet, willSet } from '../../toolkit/Decoration'
import QueuedBatchRunner from '../../toolkit/QueuedBatchRunner'
/**
 * Módulo que tem uma única instância de `AudioNode` como entrada e saída. Seus módulos filhos são conectados em série a partir dessa instância, terminando em `BaseAudioContext.destination` se não fornecido explicitamente.
 */
abstract class Element<$Node extends AudioNode, $Attributes extends Element.Attributes.Audio> extends Jack<$Node, $Attributes> {
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof $Attributes> {
		return []
	}
	/**
	 * Contexto de áudio. É criada uma nova instância de `AudioNode` ao modificar.
	 */
	@willSet(function(this: Element<$Node, $Attributes>, newValue: BaseAudioContext | undefined) {
		if (newValue !== this.context) {
			this.disconnect()
		}
	})
	@didSet(function(this: Element<$Node, $Attributes>, oldValue: BaseAudioContext | undefined) {
		const newValue = this.context

		if (newValue !== oldValue) {
			this.refreshNode()

			QueuedBatchRunner.run([Element, this], () => {
				if (newValue) {
					this.connect()
				}
			})

			this.notifyThreeMutation()
		}
	})
	protected context: BaseAudioContext | undefined
	/**
	 * Conjunto com uma única instância de `AudioNode` como entrada.
	 */
	protected get innerInputs(): Set<AudioNode> {
		return this.node && new Set([this.node]) || Module.EMPTY_SET
	}
	/**
	 * Conjunto com uma única instância de `AudioNode` como saída.
	 */
	protected get innerOutputs(): Set<AudioNode> {
		return this.node && new Set([this.node]) || Module.EMPTY_SET
	}
	/**
	 * Constrói e retorna uma instância de `AudioNode`.
	 */
	protected abstract constructNode(): $Node
	/**
	 * Conecta `this` ao fluxo do contenedor e ao primeiro módulo filho.
	 */
	protected connect(): void {
		super.connect()

		const firstChild = this.children[0] as Module | undefined

		if (firstChild) {
			Module.connect(this.outputs, firstChild.inputs)
		}
	}
	/**
	 * Desconecta `this` do fluxo do contenedor e do primeiro módulo filho.
	 */
	protected disconnect(): void {
		super.disconnect()

		const firstChild = this.children[0] as Module | undefined

		if (firstChild) {
			Module.disconnect(this.outputs, firstChild.inputs)
		}
	}
	/**
	 * Recupera os primeiros nós não vazios antes de `child` ou o nó de `this` se for o primeiro módulo filho.
	 */
	protected getFluentBackNodesToChild(child: Module): Set<AudioNode> {
		const backNodes = super.getFluentBackNodesToChild(child)
		return backNodes.size > 0 ? backNodes : this.node && new Set([this.node]) || Module.EMPTY_SET
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof $Attributes>(name: $Name, value: $Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'channelCount':          node.channelCount = value as any ?? 2;                                                                break
			case 'channelCountMode':      node.channelCountMode = value as any ?? Element.Attributes.Audio.ChannelCountMode.MAX;                break
			case 'channelInterpretation': node.channelInterpretation = value as any ?? Element.Attributes.Audio.ChannelInterpretation.SPEAKERS; break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Aplica uma parametrização no atributo com o nome especificado.
	 * @param key Nome do atributo.
	 * @param parameterization Parametrização a ser aplicada.
	 */
	protected applyParameterization(key: keyof $Node, parameterization?: Jack.Parameterization): void {
		const parameter = this.node && this.node[key] as unknown as AudioParam

		if (!parameter) {
			return
		}

		Element.applyParameterization(this.context!, parameter, parameterization)
	}
	/**
	 * Atualiza o manipulador especificado para o tipo de evento `type`, removendo o antigo manipulador caso seja especificado.
	 * @param type Tipo do evento.
	 * @param newListener Manipulador a ser adicionado.
	 * @param oldListener Manipulador a ser removido.
	 */
	protected updateEventListener(type: string, newListener?: any, oldListener?: any): void {
		Module.updateEventListener(this.node!, type, newListener, oldListener)
	}
	/**
	 * Cria e retorna um novo nó com o contexto corrente ou deleta o nó atual se não houver contexto.
	 */
	protected refreshNode(): void {
		if (this.context) {
			(this.node as any) = this.constructNode()
			super.refreshNode()
		}
		else {
			(this.node as any) = undefined
		}
	}
}
namespace Element {
	/**
	 * Atributos das tags.
	 */
	export namespace Attributes {
		/**
		 * Atributos comuns a qualquer nó de `Element`.
		 */
		export interface Audio extends Module.Attributes {
			/**
			 * Um inteiro determinando quantos canais são usados ao realizar {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Up-mixing_and_down-mixing _up-mixing and down-mixing_}.
			 * @default 2
			 */
			channelCount?: number
			/**
			 * Determina a forma como os canais devem ser correspondidos entre as entradas e saídas.
			 * @default MAX
			 */
			channelCountMode?: Audio.ChannelCountMode
			/**
			 * Determina como os canais são interpretados ao realizar {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Up-mixing_and_down-mixing _up-mixing/down-mixing_}.
			 * @default SPEAKERS
			 */
			channelInterpretation?: Audio.ChannelInterpretation
		}
		export namespace Audio {
			/**
			 * Descreve como os canais devem ser correspondidos entre as entradas e saídas do nó.
			 */
			export const enum ChannelCountMode {
				/**
				 * O número de canais é igual ao número máximo de canais de todas as conexões. Nesse caso, `channelCount` é ignorado e apenas um _up-mix_ acontece.
				 * 
				 * Classes que usam esse valor como _default_:
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/GainNode `GainNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/DelayNode `DelayNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode `ScriptProcessorNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/ChannelMergerNode `ChannelMergerNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode `BiquadFilterNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode `WaveShaperNode`}
				 */
				MAX = 'max',
				/**
				 * O número de canais é igual ao número máximo de canais de todas as conexões, não excedendo o valor de `channelCount`.
				 * 
				 * Classes que usam esse valor como _default_:
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/PannerNode `PannerNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode `ConvolverNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode `DynamicsCompressorNode`}
				 */
				CLAMPED_MAX = 'clamped-max',
				/**
				 * O número de canais é definido pelo valor de `channelCount`.
				 * 
				 * Classes que usam esse valor como _default_:
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioDestinationNode `AudioDestinationNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode `AnalyserNode`}
				 * - {@link https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode `ChannelSplitterNode`}
				 */
				EXPLICIT = 'explicit',
			}
			/**
			 * Descreve como os canais devem ser interpretados ao realizar {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Up-mixing_and_down-mixing _up-mixing and down-mixing_}.
			 */
			export const enum ChannelInterpretation {
				/**
				 * Combina todos os canais de forma mais precisa que `DISCRETE`.
				 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Up-mixing_and_down-mixing
				 */
				SPEAKERS = 'speakers',
				/**
				 * Ignora as diferenças, silenciando canais em _up-mix_ e descartando canais em _down-mix_.
				 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Up-mixing_and_down-mixing
				 */
				DISCRETE = 'discrete',
			}
		}
	}
}

export default Element