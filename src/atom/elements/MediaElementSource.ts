import Element from './Element'
/**
 * representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode `MediaElementAudioSourceNode`}.
 */
class MediaElementSource extends Element<MediaElementAudioSourceNode, MediaElementSource.Attributes> {
	/**
	 * Mapa de elementos já vinculados com algum nó. A API nativa proíbe a reutilização do mesmo elemento HTML em múltiplos nós de áudio. Quando issio acontecer, o nó será reutilizado.
	 */
	private static cache: MediaElementSource.ElementMap = new WeakMap()
	/**
	 * Contexto de áudio.
	 */
	protected context!: AudioContext
	/**
	 * Mapa de nós de áudio para o contexto de áudio corrente.
	 */
	private get nodeMap(): MediaElementSource.NodeMap {
		const context = this.context!
		let nodeMap = MediaElementSource.cache.get(context)

		if (!nodeMap) {
			MediaElementSource.cache.set(context, nodeMap = new WeakMap())
		}

		return nodeMap
	}
	/**
	 * Nó de áudio cacheado. Se não existir, será criado um.
	 */
	private get cachedNode(): MediaElementAudioSourceNode {
		const element = this.attributes.element
		const nodeMap = this.nodeMap
		let node = nodeMap.get(element)

		if (!node) {
			nodeMap.set(element, node = this.context!.createMediaElementSource(element))
		}

		return node
	}
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof MediaElementSource.Attributes> {
		return ['element']
	}
	/**
	 * Constrói um novo nó.
	 */
	protected constructNode(): MediaElementAudioSourceNode {
		return this.cachedNode
	}
}
namespace MediaElementSource {
	/**
	 * Atributos de `MediaElementSource`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * O {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement elemento} usado como fonte de áudio. Como o elemento só pode ser atrelado à uma única instância de `MediaElementAudioSourceNode`, não podendo mais ser atrelado à outra instância, é necessário recriar o elemento sempre que o componente precisar ser instanciado. Isso pode ser feito usando uma chave diferente no elemento.
		 */
		element: HTMLMediaElement
	}
	/**
	 * @internal
	 * Mapa de nós de áudio, indexados pelo elemento HTML vinculado.
	 */
	export type NodeMap = WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>
	/**
	 * @internal
	 * Mapa de `NodeMap`, indexados pelo contexto de áudio corrente.
	 */
	export type ElementMap = WeakMap<BaseAudioContext, NodeMap>
}

export default MediaElementSource
