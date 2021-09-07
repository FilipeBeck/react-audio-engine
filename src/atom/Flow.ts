import Module from './Module'
/**
 * Representa um fluxo de nós conectados em série.
 */
export default abstract class Flow<$Attributes extends Module.Attributes = Module.Attributes> extends Module<$Attributes> {
	/**
	 * Recupera os primeiros nós não vazios antes de `child`.
	 * @param child Módulo filho.
	 */
	protected getFluentBackNodesToChild(child: Module): Set<AudioNode> {
		for (let module = child.back; module !== undefined; module = module.back) {
			const nodes = module.outputs

			if (nodes.size) {
				return nodes
			}
		}

		return Module.EMPTY_SET
	}
	/**
	 * Recupera os primeiros nós não vazios depois de `child`.
	 * @param child Módulo filho.
	 */
	protected getFluentFrontNodesToChild(child: Module): Set<AudioNode> {
		for (let module = child.front; module !== undefined; module = module.front) {
			const nodes = module.inputs

			if (nodes.size) {
				return nodes
			}
		}

		return Module.EMPTY_SET
	}
}
