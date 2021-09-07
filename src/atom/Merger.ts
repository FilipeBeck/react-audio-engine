import Module from './Module'
import Branch from './Branch'
import { didSet } from '../toolkit/Decoration'
/**
 * Módulo que conecta seu antecessor com uma lista de módulos nomeados.
 */
class Merger extends Branch<Merger.Attributes> {
	/**
	 * Merger não pode ter módulos filhos.
	 */
	public children!: []
	/**
	 * Nomes dos módulos de saída.
	 */
	@didSet(function(this: Merger) {
		this.disconnect()
		this.linkModules = this.root?.getModulesByNames(this.links) || new Set()
		this.connect()
	})
	public links: Set<string>
	/**
	 * Combina as entradas de todos os módulos linkados.
	 */
	protected get innerInputs(): Set<AudioNode> {
		const nodes = new Set<AudioNode>()

		if (this.parent) {
			for (const module of this.linkModules) {
				for (const node of module.inputs) {
					nodes.add(node)
				}
			}
		}

		return nodes
	}
	/**
	 * Saídas inerentes vazias, fluídas pelo módulo pai.
	 */
	protected readonly innerOutputs: Set<AudioNode> = Module.EMPTY_SET
	/**
	 * Módulos linkados.
	 */
	private linkModules!: Set<Module>
	/**
	 * Construtor.
	 * @param attributes Atributos do módulo.
	 */
	constructor(attributes: Merger.Attributes) {
		super(attributes)
		this.links = new Set(attributes.links)
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Merger.Attributes>(name: $Name, value: Merger.Attributes[$Name]): void {
		switch (name) {
			case 'links':
				this.links = new Set(value)
			break

			default: super.applyAttribute(name, value)
		}
	}
	/**
	 * Proíbe filhos.
	 */
	public appendChild(): never {
		throw new Error()
	}
	/**
	 * Proíbe filhos.
	 */
	public insertChildBefore(): never {
		throw new Error()
	}
	/**
	 * Atualiza os módulos linkados quando houver mutações na árvore.
	 * @param root Módulo raiz.
	 */
	protected async didRootThreeMutation(root: Module): Promise<void> {
		this.disconnect()
		this.linkModules = root.getModulesByNames(this.links)
		this.connect()
	}
}
namespace Merger {
	/**
	 * Atributos de `<Merger/>`.
	 */
	export interface Attributes extends Module.Attributes {
		/**
		 * Nomes dos módulos os quais terão suas entradas conectadas com as saídas de `this`.
		 */
		links?: string[]
	}
}

export default Merger
