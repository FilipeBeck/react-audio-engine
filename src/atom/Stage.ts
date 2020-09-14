import Container from './Container'
import Scenario from './Scenario'
/**
 * Representa um container para os cenários. O mais comum é ter apenas um cenário, mas a possibilidade de ter mais de um é útil para implementar previews de efeitos e configurações de forma otimizada.
 */
export default class Stage extends Container {
	/**
	 * Cenários. As instância de `BaseAudioContext` dos cenários só existem enquanto os mesmos estiverem contidos em um `Stage`.
	 */
	readonly children!: Scenario<any>[]
	/**
	 * Adiciona o cenário `child` como último elemento de `this`.
	 * @param child Cenário a ser adicionado.
	 */
	public appendChild(child: Scenario<any>): void {
		super.appendChild(child)
		child.stage = this
	}
	/**
	 * Adiciona o cenário `child` diretamente atrás de `frontChild`.
	 * @param child Cenário a ser adicionado.
	 * @param frontChild Cenário atrás do qual `child` será adicionado.
	 */
	public insertChildBefore(child: Scenario<any>, frontChild: Scenario<any>): void {
		super.insertChildBefore(child, frontChild)
		child.stage = this
	}
	/**
	 * Remove o cenário `child` de `this`.
	 * @param child Cenário a ser removido.
	 */
	public removeChild(child: Scenario<any>): void {
		super.removeChild(child)
		child.stage = undefined
	}
}