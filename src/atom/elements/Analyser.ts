import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode `AnalyserNode`}.
 */
class Analyser extends Element<AnalyserNode, Analyser.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): AnalyserNode {
		return this.context!.createAnalyser()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Analyser.Attributes>(name: $Name, value: Analyser.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'fftSize':               node.fftSize = value as number ?? 2048;              break
			case 'minDecibels':           node.minDecibels = value as number ?? -100;          break
			case 'maxDecibels':           node.maxDecibels = value as number ?? -30;           break
			case 'smoothingTimeConstant': node.smoothingTimeConstant = value as number ?? 0.8; break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace Analyser {
	/**
	 * Atributos de `Analyser`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Tamanho da FFT ({@link http://en.wikipedia.org/wiki/Fast_Fourier_transform Transformada Rápida de Fourier}). Precisa ser potência de 2 e estar em uma faixa de [32, 32768].
		 * @default 2048
		 */
		fftSize?: number
		/**
		 * Valor mínimo de amplitude a ser considerado pela FFT ao recuperar as informações de análise. Valores abaixo serão filtrados.
		 * @default -100
		 */
		minDecibels?: number
		/**
		 * Valor máximo de amplitude a ser considerado pela FFT ao recuperar as informações de análise. Valores acima serão filtrados.
		 * @default -30
		 */
		maxDecibels?: number
		/**
		 * Valor entre [0, 1] determinando a suavidade entre os buffers. Quanto maior, mais o buffer anterior será combinado com o atual.
		 * @default 0.8
		 */
		smoothingTimeConstant?: number
	}
}

export default Analyser