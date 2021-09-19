import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/IIRFilterNode `IIRFilterNode`}.
 */
class IIRFilter extends Element<IIRFilterNode, IIRFilter.Attributes> {
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected override get attributesConstructionKeys(): Array<keyof IIRFilter.Attributes> {
		return ['feedBackward', 'feedForward']
	}
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): IIRFilterNode {
		return this.context!.createIIRFilter(this.attributes.feedBackward, this.attributes.feedForward)
	}
}
namespace IIRFilter {
	/**
	 * Atributos de `IRRFilter`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Uma sequência de coeficientes _feed backward_.
		 */
		feedBackward: number[]
		/**
		 * Uma sequência de coeficientes _feed forward_.
		 */
		feedForward: number[]
	}
}

export default IIRFilter
