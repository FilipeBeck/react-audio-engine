import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode `WaveShaperNode`}.
 */
class WaveShaper extends Element<WaveShaperNode, WaveShaper.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): WaveShaperNode {
		return this.context!.createWaveShaper()
	}
	/**
	 * Estabelece o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof WaveShaper.Attributes>(name: $Name, value: WaveShaper.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'curve':      node.curve = value as Float32Array ?? null;                                     break
			case 'oversample': node.oversample = value as WaveShaper.Oversample ?? WaveShaper.Oversample.NONE; break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace WaveShaper {
	/**
	 * Atributos de `WaveShaper`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Valores aplicados ao sinal de forma interpolada, sendo o primeiro elemento aplicado à sinais com ganho -1 e o último elemento aplicado à sinais com ganho +1. Sinais abaixo de -1 serão tratados como -1 e sinais acima de +1 serão tratados como +1. Se `null`, nenhuma alteração é feita no sinal.
		 * @default null
		 */
		curve?: Float32Array | null
		/**
		 * Determina se e como deve ser aplicada a técnica de {@link https://en.wikipedia.org/wiki/Oversampling oversampling}.
		 * @default NONE
		 */
		oversample?: WaveShaper.Oversample
	}
	/**
	 * Técnica de {@link https://en.wikipedia.org/wiki/Oversampling oversampling} aplicada à curva. Oversampling é uma técnica onde se cria mais amostras antes de aplicar o efeito de distorção ao sinal. Uma vez aplicada, o número de amostras é reduzido ao valor inicial. Isso leva a resultados melhores devido à redução de {@link https://en.wikipedia.org/wiki/Aliasing cerrilhamento}, mas às custas de uma curva de modelagem com precisão mais baixa.
	 */
	export const enum Oversample {
		/**
		 * Nenhuma técnica é aplicada.
		 */
		NONE = 'none',
		/**
		 * Dobra a quantidade de amostras antes de aplicar a curva.
		 */
		X2 = '2x',
		/**
		 * Quadruplica a quantidade de amostras antes de aplicar a curva.
		 */
		X4 = '4x',
	}
}

export default WaveShaper
