import Container from './Container'
import { didSet } from '../toolkit/Decoration'
import QueuedBatchRunner from '../toolkit/QueuedBatchRunner'
/**
 * Classe base para os demais componentes de áudio. Um módulo de áudio é análogo à uma rede neural (com instâncias de `AudioNode` no lugar de neurônios) do ponto de vista de sua estrutura e a forma como as conexões são feitas com outros módulos. Ele possui um conjunto de instâncias de `AudioNode` como entrada, um conjunto de instâncias de `AudioNode` como saída e um conjunto de instâncias de `AudioNode` intermediários. As conexões são feitas recuperando todas as saídas de um módulo e conectando cada uma delas com todas as entradas de um módulo frontal. Caso um módulo não contenha entradas, será recuperada as entradas do módulo mais próximo de forma recursiva, e a forma como as entradas são recuperadas depende do módulo pai. O mesmo ocorre para um módulo que não contiver saídas, sendo recuperada as saídas do módulo mais próximo de forma recursiva. A única classe que define instâncias de `AudioNode` próprias como entradas e saídas é `Element`, possuindo um único `AudioNode` que serve tanto como entrada quanto saída. As demais classes apenas manipulam as entradas, saídas e conexões.
 */
abstract class Module<$Attributes extends Module.Attributes = Module.Attributes> extends Container {
	/**
	 * Conjunto vazio de nós para efeitos de otimização.
	 */
	protected static readonly EMPTY_SET = new Set<AudioNode>()
	/**
	 * Atualiza o manipulador para os eventos do tipo `type` despachados por `target`, removendo o antigo manipulador caso seja especificado.
	 * @param target Despachante de eventos, alvo do manipulador.
	 * @param type Tipo de eventos que devem ser manipulados.
	 * @param newListener Manipulador a ser adicionado.
	 * @param oldListener Manipulador a ser removido.
	 */
	protected static updateEventListener(target: EventTarget, type: string, newListener?: any, oldListener?: any): void {
		if (oldListener) {
			target.removeEventListener(type, oldListener)
		}

		if (newListener) {
			target.addEventListener(type, newListener)
		}
	}
	/**
	 * Conecta `backNodes` com `frontNodes`.
	 * @param backNodes Nós de saída que enviam o sinal para `frontNodes`.
	 * @param frontNodes Nós de entrada que recebem o sinal de `backNodes`.
	 */
	protected static connect(backNodes: Set<AudioNode>, frontNodes: Set<AudioNode>): void {
		for (const backNode of backNodes) {
			for (const frontNode of frontNodes) {
				if (backNode !== frontNode) {
					backNode.connect(frontNode)
				}
			}
		}
	}
	/**
	 * Desconecta `backNodes` de `frontNodes`.
	 * @param backNodes Nós de saída que irão deixar de enviar o sinal para `frontNodes`.
	 * @param frontNodes Nós de entrada que irão deixar de receber o sinal de `backNodes`.
	 */
	protected static disconnect(backNodes: Set<AudioNode>, frontNodes: Set<AudioNode>): void {
		for (const backNode of backNodes) {
			for (const frontNode of frontNodes) {
				if (backNode !== frontNode) {
					try {
						backNode.disconnect(frontNode)
					}
					catch (error) {
						if (!(error instanceof DOMException) || error.code !== DOMException.INVALID_ACCESS_ERR) {
							throw error
						}
					}
				}
			}
		}
	}
	/**
	 * Nós de entrada. São as entradas inerentes ao módulo ou, se vazio, os nós do módulo mais próximo, dependendo do módulo pai.
	 */
	public get inputs(): Set<AudioNode>  {
		const nodes = this.innerInputs

		if (nodes.size) {
			return nodes
		}

		return this.getBubbledFluentFrontNodes()
	}
	/**
	 * Nós de saída. São as saídas inerentes ao módulo ou, se vazio, os nós do módulo mais próximo, dependendo do módulo pai.
	 */
	public get outputs(): Set<AudioNode> {
		const nodes = this.innerOutputs

		if (nodes.size) {
			return nodes
		}

		return this.getBubbledFluentBackNodes()
	}
	/**
	 * Nome para o módulo. Útil para identificação. Notifica mutações à arvore quando modificado.
	 */
	@didSet(function(this: Module) {
		this.notifyThreeMutation()
	})
	public name?: string
	/**
	 * Módulo pai
	 */
	public parent?: Module
	/**
	 * Módulos filhos.
	 */
	public readonly children!: Module[]
	/**
	 * Módulo raiz.
	 */
	public get root(): Module | undefined {
		let module = this.parent

		do {
			if (!module?.parent) {
				return module
			}
		}
		while (module = module.parent)

		return undefined
	}
	/**
	 * Módulo diretamente atrás de `this`.
	 */
	public get back(): Module | undefined {
		const parent = this.parent
		const indexOfThis = parent?.children.indexOf(this)

		return indexOfThis !== undefined ? parent!.children[indexOfThis - 1] : undefined
	}
	/**
	 * Módulo diretamente à frente de `this`.
	 */
	public get front(): Module | undefined {
		const parent = this.parent
		const indexOfThis = parent?.children.indexOf(this)

		return indexOfThis !== undefined ? parent!.children[indexOfThis + 1] : undefined
	}
	/**
	 * Contexto de áudio compartilhado por todos os módulos filhos.
	 */
	@didSet(function(this: Module) {
		for (const module of this.children) {
			module.context = this.context
		}
	})
	protected context?: BaseAudioContext
	/**
	 * Atributos do módulo.
	 */
	protected attributes: $Attributes
	/**
	 * Entradas inerentes ao módulo.
	 */
	protected abstract innerInputs: Set<AudioNode>
	/**
	 * Saídas inerentes ao módulo.
	 */
	protected abstract innerOutputs: Set<AudioNode>
	/**
	 * Construtor
	 * @param attributes Atributos do módulo.
	 */
	constructor(attributes: $Attributes) {
		super()

		this.attributes = attributes

		if (attributes.name) {
			this.name = attributes.name
		}
	}
	/**
	 * Recupera o valor do atributo com o nome especificado.
	 * @param name Node do atributo.
	 */
	public getAttribute<$Name extends keyof $Attributes>(name: $Name): $Attributes[$Name] {
		return this.attributes[name]
	}
	/**
	 * Estabelece o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	public setAttribute<$Name extends keyof $Attributes>(name: $Name, value: $Attributes[$Name]): void {
		this.applyAttribute(name, value)
		this.attributes[name] = value
	}
	/**
	 * Recupera os módulos filhos com os nomes especificados, diretos ou indiretos.
	 * @param names Nomes dos módulos.
	 */
	public getModulesByNames(names: Set<string>): Set<Module> {
		const result = new Set<Module>()

		for (const module of this.children) {
			for (const name of names) {
				if (module.name === name) {
					result.add(module)
				}
			}

			for (const child of module.getModulesByNames(names)) {
				result.add(child)
			}
		}

		return result
	}
	/**
	 * Adiciona o módulo `child` como último componente de `this`.
	 * @param child Módulo a ser adicionado.
	 */
	public appendChild(child: Module): void {
		this.willInsertChild(child)
		super.appendChild(child)
		this.didInsertChild(child)
	}
	/**
	 * Adiciona o módulo `child` diretamente atrás de `frontChild`.
	 * @param child Módulo a ser adicionado.
	 * @param frontChild Módulo atrás do qual `child` será adicionado.
	 */
	public insertChildBefore(child: Module, frontChild: Module): void {
		this.willInsertChild(child)
		super.insertChildBefore(child, frontChild)
		this.didInsertChild(child)
	}
	/**
	 * Remove o módulo `child` de `this`.
	 * @param child Módulo a ser removido.
	 */
	public removeChild(child: Module): void {
		this.willRemoveChild(child)
		super.removeChild(child)
		this.didRemoveChild(child)
	}
	/**
	 * Recupera os nós mais próximos que sirvam de entradas para as saídas de `child`.
	 * @param child Módulo filho.
	 */
	protected abstract getFluentBackNodesToChild(child: Module): Set<AudioNode>
	/**
	 * Recupera os nós mais próximos que sirvam como entradas para as saídas de `child`.
	 * @param child Mpódulo filho.
	 */
	protected abstract getFluentFrontNodesToChild(child: Module): Set<AudioNode>
	/**
	 * Invocado logo após a árvore onde `this` se encontra ter sido modificada.
	 * @param root Módulo raiz.
	 */
	protected didRootThreeMutation?(root: Module): void
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof $Attributes>(name: $Name, value: $Attributes[$Name]): void {
		switch (name) {
			case 'name':
				this.name as any !== value && (this.name = value as $Attributes['name'])
			break

			default: throw new Error(`Attribute \`${name}\` not exists.`)
		}
	}
	/**
	 * Conecta `this` ao fluxo do contenedor.
	 */
	protected connect(): void {
		const backNodes = this.getBubbledFluentBackNodes()
		const frontNodes = this.getBubbledFluentFrontNodes()

		Module.disconnect(backNodes, frontNodes)
		Module.connect(backNodes, this.inputs)
		Module.connect(this.outputs, frontNodes)
	}
	/**
	 * Desconecta `this` do fluxo do contenedor.
	 */
	protected disconnect(): void {
		const backNodes = this.getBubbledFluentBackNodes()
		const frontNodes = this.getBubbledFluentFrontNodes()

		Module.connect(backNodes, frontNodes)
		Module.disconnect(backNodes, this.inputs)
		Module.disconnect(this.outputs, frontNodes)
	}
	/**
	 * Recupera os nós de conexão mais próximos que sirvam como saídas para as entradas de `this` de forma recursiva.
	 */
	protected getBubbledFluentBackNodes(): Set<AudioNode> {
		for (let module: Module | undefined = this.parent, child: Module | undefined = this; module !== undefined; module = module.parent) {
			const nodes = module.getFluentBackNodesToChild(child)

			if (nodes.size) {
				return nodes
			}

			child = module
		}

		return Module.EMPTY_SET
	}
	/**
	 * Recupera os nós de conexão mais próximos que sirvam como entrada para as saídas de `this` de forma recursiva.
	 */
	protected getBubbledFluentFrontNodes(): Set<AudioNode> {
		for (let module: Module | undefined = this.parent, child: Module | undefined = this; module !== undefined; module = module.parent) {
			const nodes = module.getFluentFrontNodesToChild(child)

			if (nodes.size) {
				return nodes
			}

			child = module
		}

		return Module.EMPTY_SET
	}
	/**
	 * Notifica `this` e os módulos filhos sobre as alterações na àrvore em que `this` está contido.
	 */
	protected notifyThreeMutation(): void {
		function notify(root: Module, module: Module): void {
			if (module.didRootThreeMutation) {
				module.didRootThreeMutation(root)
			}

			for (const child of module.children) {
				notify(root, child)
			}
		}

		if (this.context) {
			QueuedBatchRunner.run([Module, this.context], () => {
				const root = this.root || this
				notify(root, root)
			}, true)
		}
	}
	/**
	 * Lança uma exceção se `child` já estiver contido em outro módulo antes de ser adicionado à `this`.
	 * @param child Módulo a ser adicionado.
	 */
	private willInsertChild(child: Module): void {
		if (child.parent) {
			throw new Error()
		}
	}
	/**
	 * Atualiza as conexões logo após `child` ser adicionado à `this`.
	 * @param child Módulo que foi adicionado.
	 */
	private didInsertChild(child: Module): void {
		child.parent = this
		child.context = this.context
		child.connect()
		child.notifyThreeMutation()
	}
	/**
	 * Atualiza as conexões quando `child` estiver prestes a ser removido de `this`.
	 * @param child Módulo a ser removido.
	 */
	private willRemoveChild(child: Module): void {
		child.disconnect()
		child.parent = undefined
		child.context = undefined
	}
	/**
	 * Notifica mudanças na árvore logo após `child` ser removido de `this`.
	 * @param child Módulo removido.
	 */
	private didRemoveChild(child: Module): void {
		child.notifyThreeMutation()
	}
}
namespace Module {
	/**
	 * Atributos comuns a todos os módulos.
	 */
	export interface Attributes {
		/**
		 * Nome do módulo. Útil para identificação e necessário para `Merger`.
		 */
		name?: string
	}
}

export default Module
