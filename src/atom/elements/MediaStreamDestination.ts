import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode `MediaStreamAudioDestinationNode`}.
 */
class MediaStreamDestination extends Element<MediaStreamAudioDestinationNode, MediaStreamDestination.Attributes> {
	/**
	 * Contexto de áudio.
	 */
	protected context!: AudioContext
	/**
	 * Constrói e retorna uma nova instância do nó.
	 */
	protected constructNode(): MediaStreamAudioDestinationNode {
		return this.context!.createMediaStreamDestination()
	}
}
namespace MediaStreamDestination {
	/**
	 * Atributos de `MediaStreamDestination`.
	 */
	export type Attributes = Element.Attributes.Audio
}

export default MediaStreamDestination
