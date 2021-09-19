import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode `MediaStreamAudioSourceNode`}.
 */
class MediaStreamSource extends Element<MediaStreamAudioSourceNode, MediaStreamSource.Attributes> {
	/**
	 * Contexto de áudio.
	 */
	protected override context!: AudioContext
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected override get attributesConstructionKeys(): Array<keyof MediaStreamSource.Attributes> {
		return ['media']
	}
	/**
	 * Constrói e retorna uma nova instância do nó.
	 */
	protected constructNode(): MediaStreamAudioSourceNode {
		return this.context!.createMediaStreamSource(this.attributes.media)
	}
}
namespace MediaStreamSource {
	/**
	* Atributos de `MediaStreamSource`.
	*/
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Fonte de áudio.
		 */
		media: MediaStream
	}
}

export default MediaStreamSource
