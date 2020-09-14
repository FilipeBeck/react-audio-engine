import Jack from '../Jack'
import ScheduledSource from './ScheduledSource'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode `ConstantSourceNode`}.
 */
class ConstantSource extends ScheduledSource<ConstantSourceNode, ConstantSource.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): ConstantSourceNode {
		return this.context!.createConstantSource()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof ConstantSource.Attributes>(name: $Name, value: ConstantSource.Attributes[$Name]): void {
		switch (name) {
			case 'offset':
				this.applyParameterization('offset', value as Jack.Parameterization)
			break
			
			default: super.applyAttribute(name, value)
		}
	}
}
namespace ConstantSource {
	/**
	 * Atributos de `ConstantSource`.
	 */
	export interface Attributes extends ScheduledSource.Attributes {
		/**
		 * Especifica o valor contínuo da saída.
		 * @default 1.0
		 */
		offset?: Jack.Parameterization
	}
}

export default ConstantSource