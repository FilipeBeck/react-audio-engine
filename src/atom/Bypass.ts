import Branch from './Branch'
import Module from './Module'
/**
 * Módulo que ramifica o sinal recebido, terminando em `AudioContext.destination` se não fornecido explicitamente.
 */
class Bypass extends Branch<Bypass.Attributes> {
	/**
	 * Soma das entradas do primeiro módulo filho e módulo adjacente.
	 */
	protected get innerInputs(): Set<AudioNode> {
		const nodes = new Set<AudioNode>()
		const firstChildNodes = this.children[0]?.inputs as Set<AudioNode> | undefined
		const frontModuleNodes = this.getBubbledFluentFrontNodes()

		if (firstChildNodes) {
			for (const node of firstChildNodes) {
				nodes.add(node)
			}
		}

		if (frontModuleNodes) {
			for (const node of frontModuleNodes) {
				nodes.add(node)
			}
		}

		return nodes
	}
	/**
	 * Saídas inerentes vazias, fluidas pelo módulo pai.
	 */
	protected readonly innerOutputs: Set<AudioNode> = new Set()
}
namespace Bypass {
	/**
	 * Atributos de `Bypass`.
	 */
	export type Attributes = Module.Attributes
}

export default Bypass