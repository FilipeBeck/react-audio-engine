import Module from './Module'
/**
 * Módulo que conecta cada filho de forma paralela com o módulo anterior e combina as suas saídas paralelamente.
 */
class Mixer extends Module<Mixer.Attributes> {
	/**
	 * Combinação das entradas de todos os módulos que são filhos diretos.
	 */
	protected get innerInputs(): Set<AudioNode> {
		const nodes = new Set<AudioNode>()

		for (const module of this.children) {
			for (const node of module.inputs) {
				nodes.add(node)
			}
		}

		return nodes
	}
	/**
	 * Combinação das saídas de todos os módulos que são filhos diretos.
	 */
	protected get innerOutputs(): Set<AudioNode> {
		const nodes = new Set<AudioNode>()

		for (const module of this.children) {
			for (const node of module.outputs) {
				nodes.add(node)
			}
		}

		return nodes
	}
	/**
	 * Recupera uma lista vazia, já que os módulos filhos não são conectados entre si.
	 */
	protected getFluentBackNodesToChild(): Set<AudioNode> {
		return Module.EMPTY_SET
	}
	/**
	 * Recupera uma lista vazia, já que os módulos filhos não são conectados entre si.
	 */
	protected getFluentFrontNodesToChild(): Set<AudioNode> {
		return Module.EMPTY_SET
	}
}
namespace Mixer {
	/**
	 * Atributos de `Mixer`.
	 */
	export type Attributes = Module.Attributes
}

export default Mixer
