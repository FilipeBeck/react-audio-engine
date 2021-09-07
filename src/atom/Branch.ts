import Module from './Module'
import Flow from './Flow'
/**
 * Representa um fluxo cujo destino é ramificado, terminando em `BaseAudioContext.destination` se não fornecido explicitamente.
 */
export default abstract class Branch<$Attributes extends Module.Attributes = Module.Attributes> extends Flow<$Attributes> {
	/**
	 * Recupera os primeiros nós não vazios depois de child. Se vazio, retorna as saídas de child se forem nós de destino, ou o destino de `BaseAudioContext.destination`, caso contrário.
	 * @param child Módulo filho.
	 */
	protected getFluentFrontNodesToChild(child: Module): Set<AudioNode> {
		const nodes = super.getFluentFrontNodesToChild(child)

		if (nodes.size) {
			return nodes
		}

		const childNodes = child.outputs
		let destinationCount = 0

		for (const node of childNodes) {
			if (!node.numberOfOutputs) {
				destinationCount++
			}
		}

		if (destinationCount && destinationCount !== childNodes.size) {
			throw new Error('A `Branch` cannot mix destiny nodes with another nodes.')
		}

		return destinationCount ? childNodes : this.context && new Set([this.context.destination]) || Module.EMPTY_SET
	}
}
