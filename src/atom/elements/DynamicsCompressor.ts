import Element from './Element'
import Jack from '../Jack'
/**
 * representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode `DynamicsCompressorNode`}.
 */
class DynamicsCompressor extends Element<DynamicsCompressorNode, DynamicsCompressor.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): DynamicsCompressorNode {
		return this.context!.createDynamicsCompressor()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof DynamicsCompressor.Attributes>(name: $Name, value: DynamicsCompressor.Attributes[$Name]): void {
		switch (name) {
			case 'threshold': case 'knee': case 'ratio': case 'attack': case 'release':
				this.applyParameterization(name as keyof DynamicsCompressorNode, value as Jack.Parameterization)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace DynamicsCompressor {
	/**
	 * Atributos de `DynamicsCompressor`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/DOM/AudioParam#k-rate k-rate} representando o valor mínimo de amplitude que o compressor irá afetar.
		 * @default -24
		 */
		threshold?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/DOM/AudioParam#k-rate k-rate} representando a faixa acima do `threshold` em que a curva suaviza para a porção comprimida.
		 * @default 30
		 */
		knee?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/DOM/AudioParam#k-rate k-rate} representando o montante de mudança, em dB, necessário na entrada para haver 1 dB de mudança na saída.
		 * @default 12
		 */
		ratio?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/DOM/AudioParam#k-rate k-rate} representando o montante de tempo, em segundos, necessário para reduzir o ganho em 10 dB.
		 * @default 0.003
		 */
		attack?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/DOM/AudioParam#k-rate k-rate} representando o montante de tempo, em segundos, necessário para aumentar o ganho em 10 dB.
		 * @default 0.25
		 */
		release?: Jack.Parameterization
	}
}

export default DynamicsCompressor