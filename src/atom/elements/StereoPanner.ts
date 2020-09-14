import Element from './Element'
import Jack from '../Jack'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode `StereoPannerNode`}.
 */
class StereoPanner extends Element<StereoPannerNode, StereoPanner.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): StereoPannerNode {
		return this.context!.createStereoPanner()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof StereoPanner.Attributes>(name: $Name, value: StereoPanner.Attributes[$Name]): void {
		switch (name) {
			case 'pan':
				this.applyParameterization(name as keyof StereoPannerNode, value as Jack.Parameterization)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace StereoPanner {
	/**
	 * Atributos de `StereoPanner`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando o offset a ser aplicado. Quando -1, o canal direito fica silenciado. Quando +1, o canal esquerdo fica silenciado. Quando 0, o volume fica equilibrado entre os dois canais.
		 * @default 0
		 */
		pan?: Jack.Parameterization
	}
}

export default StereoPanner