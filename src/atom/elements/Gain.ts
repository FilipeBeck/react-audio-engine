import Element from './Element'
import Jack from '../Jack'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/GainNode `GainNode`}.
 */
class Gain extends Element<GainNode, Gain.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): GainNode {
		return this.context!.createGain()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected override applyAttribute<$Name extends keyof Gain.Attributes>(name: $Name, value: Gain.Attributes[$Name]): void {
		switch (name) {
			case 'level':
				this.applyParameterization('gain', value as Jack.Parameterization)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace Gain {
	/**
	 * Atributos de `Gain`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando o montante de ganho a ser aplicado.
		 * @default 1
		 */
		level?: Jack.Parameterization
	}
}

export default Gain
