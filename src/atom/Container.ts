/**
 * Representa um agregado recursivo.
 */
export default abstract class Container {
	/**
	 * Containers filhos.
	 */
	public readonly children: Container[] = []
	/**
	 * Adiciona o container `child` como último elemento de `this`.
	 * @param child Container a ser adicionado.
	 */
	public appendChild(child: Container): void {
		this.children.push(child)
	}
	/**
	 * Adiciona o container `child` diretamente atrás de `frontChild`.
	 * @param child Container a ser adicionado.
	 * @param frontChild Container atrás do qual `child` será adicionado.
	 */
	public insertChildBefore(child: Container, frontChild: Container): void {
		const children = this.children
		const indexOfBeforeChild = children.indexOf(frontChild)

		children.splice(indexOfBeforeChild, 0, child)
	}
	/**
	 * Remove o container `child` de `this`.
	 * @param child Container a ser removido.
	 */
	public removeChild(child: Container): void {
		const children = this.children
		const indexOfChild = children.indexOf(child)

		children.splice(indexOfChild, 1)
	}
}