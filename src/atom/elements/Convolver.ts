import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode `ConvolverNode`}.
 */
class Convolver extends Element<ConvolverNode, Convolver.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): ConvolverNode {
		return this.context!.createConvolver()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Convolver.Attributes>(name: $Name, value: Convolver.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'buffer':    node.buffer = value as AudioBuffer ?? null; break
			case 'normalize': node.normalize = value as boolean ?? true;  break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace Convolver {
	/**
	 * Atributos de `Convolver`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Um {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer `AudioBuffer`} contendo _mono_, _stereo_ ou _quad_ contendo a {@link https://en.wikipedia.org/wiki/Impulse_response resposta ao impulso} (possivelmente multicanal) usado para criar o efeito de reverb.
		 * @default null
		 */
		buffer?: AudioBuffer
		/**
		 * Determina se a {@link https://en.wikipedia.org/wiki/Impulse_response resposta ao impulso} do buffer será normalizada.
		 * @default true
		 */
		normalize?: boolean
	}
}

export default Convolver
