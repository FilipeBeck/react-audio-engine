import Element from './Element'
import Jack from '../Jack'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/DelayNode `DelayNode`}.
 */
class Delay extends Element<DelayNode, Delay.Attributes> {
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof Delay.Attributes> {
		return ['maxTime']
	}
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): DelayNode {
		return this.context!.createDelay(this.attributes.maxTime)
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Delay.Attributes>(name: $Name, value: Delay.Attributes[$Name]): void {
		switch (name) {
			case 'time':
				this.applyParameterization('delayTime', value as Jack.Parameterization)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace Delay {
	/**
	 * Atributos de `Delay`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando o montante de delay (em segundos) a ser aplicado.
		 * @default 0
		 */
		time?: Jack.Parameterization
		/**
		 * O tempo máximo, sem segundos, que o sinal pode ser atrasado. Precisa ser menor que 180.
		 * @default 1
		 */
		maxTime?: number
	}
}

export default Delay
