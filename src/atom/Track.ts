import Flow from './Flow'
import Module from './Module'
/**
 * Módulo que conecta cada módulo filho em série e tem como entradas e saídas o primeiro e último módulo, respectivamente.
 */
class Track extends Flow<Track.Attributes> {
	/**
	 * Entradas do primeiro módulo filho.
	 */
	protected get innerInputs(): Set<AudioNode> {
		return this.children[0]?.inputs || Module.EMPTY_SET
	}
	/**
	 * Saídas do último módulo filho.
	 */
	protected get innerOutputs(): Set<AudioNode> {
		const components = this.children
		return components[components.length - 1]?.outputs || Module.EMPTY_SET
	}
}
namespace Track {
	/**
	 * Atributos de `Track`.
	 */
	export type Attributes = Module.Attributes
}

export default Track
