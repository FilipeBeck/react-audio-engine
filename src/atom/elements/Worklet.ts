import Element from './Element'
import Event from '../../toolkit/Event'
import Jack from '../Jack'
/**
 * representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet `AudioWorklet`}.
 */
class Worklet extends Element<AudioWorkletNode, Worklet.Attributes> {
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof Worklet.Attributes> {
		return [
			'processorName',
			'numberOfInputs',
			'numberOfOutputs',
			'outputChannelCount',
			'parameterData',
			'processorOptions',
		]
	}
	/**
	 * Constrói e retorna uma nova instância do nó.
	 */
	protected constructNode(): AudioWorkletNode {
		return new AudioWorkletNode(this.context!, this.attributes.processorName, this.attributes)
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Worklet.Attributes>(name: $Name, value: Worklet.Attributes[$Name]): void {
		switch (name) {
			case 'parameters': {
				for (let key in value) {
					this.applyParameterization(key, value as Jack.Parameterization)
				}
			}break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Aplica uma parametrização no atributo com o nome especificado.
	 * @param key Nome do atributo.
	 * @param parameterization Parametrização a ser aplicada.
	 */
	protected applyParameterization(key: string, parameterization: Jack.Parameterization | undefined): void {
		const parameter = this.node && this.node.parameters.get(key)

		if (!parameter) {
			return
		}

		Element.applyParameterization(this.context!, parameter, parameterization)
	}
}
namespace Worklet {
	/**
		 * Atributos de `Worklet`.
		 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Nome da instância de {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor `AudioWorkletProcessor`} registrado com {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope/registerProcessor `AudioWorkletGlobalScope.registerProcessor()`} que esse nó irá usar.
		 */
		processorName: string
		/**
		 * Número de entradas.
		 * @default 1
		 */
		numberOfInputs?: number
		/**
		 * Número de saídas.
		 * @default 1
		 */
		numberOfOutputs?: number
		/**
		 * Número de canais para cada saída. A quantidade de elementos precisa ser igual à `numberOfOutputs`.
		 */
		outputChannelCount?: number[]
		/**
		 * Um dicionário com valores iniciais para instâncias de {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam `AudioParam`} customizadas, onde a chave é o nome do parâmetro customizado.
		 */
		parameterData?: Record<string, number>
		/**
		 *
		 */
		parameters?: Record<string, Jack.Parameterization>
		/**
		 * Qualquer dado adicional que pode ser usado para inicialização customizada.
		 */
		processorOptions?: any
		/**
		 * Invocado quando ocorre um erro no {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor `AudioWorkletProcessor`} associado. Uma vez ocorrido o erro, o processador e, consequentemente, o nó irão reproduzir silêncio durante todo o resto de seu ciclo de vida.
		 * @param event Evento associado.
		 */
		onProcessorError(event: Event<AudioWorkletNode>): void
	}
}

export default Worklet
