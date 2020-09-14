import Element from './Element'
import Jack from '../Jack'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode `BiquadFilterNode`}.
 */
class BiquadFilter extends Element<BiquadFilterNode, BiquadFilter.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): BiquadFilterNode {
		return this.context!.createBiquadFilter()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof BiquadFilter.Attributes>(name: $Name, value: BiquadFilter.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'type':
				node.type = value as BiquadFilter.Type ?? BiquadFilter.Type.LOWPASS
			break
			
			case 'frequency': case 'detune': case 'Q': case 'gain': case 'type':
				this.applyParameterization(name as keyof typeof node, value as Jack.Parameterization)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace BiquadFilter {
	/**
	 * Atributos de `BiquadFilter`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Parâmetros do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a frequência no algoritmo de filtragem atual, medido em hertz (Hz).
		 * @default 350
		 */
		frequency?: Jack.Parameterization
		/**
		 * Parâmetros do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a dessintonização da frequência em {@link http://en.wikipedia.org/wiki/Cent_%28music%29 cents}.
		 * @default 0
		 */
		detune?: Jack.Parameterization
		/**
		 * Parâmetros do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando um {@link http://en.wikipedia.org/wiki/Q_factor Q factor}, ou _fator de qualidade_.
		 * @default 1
		 */
		Q?: Jack.Parameterization
		/**
		 * Parâmetros do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando o ganho utilizado no algoritmo de filtro.
		 * @default 0
		 */
		gain?: Jack.Parameterization
		/**
		 * Define o tipo de algoritmo de filtragem a ser implementado.
		 * @default LOWPASS
		 */
		type?: BiquadFilter.Type
	}
	/**
	 * Define o tipo de algoritmo de filtragem que `BiquadFilter` está implementando, afetando o significado de seus atributos (exceto detune, que tem o mesmo significado para todos).
	 */
	export const enum Type {
		/**
		 * Filtro de resonância lowpass padrão de segunda ordem com 12dB/octave rolloff. Frequências abaixo do ponto de corte passam; frequências acima são atenuadas.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - Controla a frequência de corte.
		 * - `Q` - Indica o quão perto a frequência chegou em relação ao ponto de corte. Quanto maior o valor, maior será a aproximação.
		 * - `gain` - Não utilizado.
		 */
		LOWPASS = 'lowpass',
		/**
		 * Filtro de resonância highpass padrão de segunda ordm com 12dB/octave rolloff. Frequências abaixo do ponto de corte são atenuadas; frequências acima passam.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - Controla a frequência de corte.
		 * - `Q` - Indica o quão perto a frequência chegou em relação ao ponto de corte. Quanto maior o valor, maior será a aproximação.
		 * - `gain` - Não utilizado.
		 */
		HIGHPASS = 'highpass',
		/**
		 * Filtro bandpass padrão de segunda ordem. Frequências fora do dado limite de frequências são atenuadas; frequências dentro do limite passam.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - Controla o centro de alcance de frequências.
		 * - `Q` - Controla a largura da banda de frequência. Quanto maior o valor Q, menor a frequência de banda.
		 * - `gain` - Não utilizado.
		 */
		BANDPASS = 'bandpass',
		/**
		 * Filtro lowshelf padrão de segunda ordem. Frequências menores que a frequência recebem um aumento, ou uma atenuação; frequências maiores não sofrem alterações.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - O limite superior das frequênicas recebe um aumento ou atenuação.
		 * - `Q` - Não utilizado.
		 * - `gain` - O aumento, em dB, para ser aplicado; se negativo, ele será uma atenuação.
		 */
		LOWSHELF = 'lowshelf',
		/**
		 * Filtro highshelf padrão de segunda ordem. Frequências maiores que a frequência recebem aumento ou atenuação; frequências abaixo disso não sofrem alterações.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - O limite inferior de frequências recebe aumento ou uma atenuação.
		 * - `Q` - Não utilizado.
		 * - `gain` - O aumento, em dB, para ser aplicado; se negativo, ele será uma atenuação.
		 */
		HIGHSHELF = 'highshelf',
		/**
		 * Frequências dentro da faixa de frequencias  recebem aumento ou atenuação; frequências fora da faixa não sofrem alterações.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - O meio da faixa de frequência recebe um aumento ou uma atenuação.
		 * - `Q` - Controla a largura da banda de frequência. Quanto maior o valor Q, menor a frequência de banda.
		 * - `gain` - O aumento, em dB, para ser aplicado; se negativo, ele será uma atenuação.
		 */
		PEAKING = 'peaking',
		/**
		 * Filtro {@link http://en.wikipedia.org/wiki/Band-stop_filter notch} padrão, também chamado de filtro band-stop ou band-rejection. É o oposto do filtro de de bandpass: frequências fora da faixa de frequências atribuída passam; frequências de dentro da faixa são atenuadas.
		 * 
		 * Comportamento dos atributos:
		 * - `frequency` - O centro de alcance de frequências.
		 * - `Q` - Controla a largura da banda de frequência. Quanto maior o valor Q, menor a frequência de banda.
		 * - `gain` - Não aplicado.
		 */
		NOTCH = 'notch',
		/**
		 * Filtro {@link http://en.wikipedia.org/wiki/All-pass_filter#Digital_Implementation allpass} padrão de segunda ordem. Permite que todas as frequências passem, porém altera a relação de fase entre as diversas frequências.
		 *
		 * Comportamento dos atributos:
		 * - `frequency` - A frequência com o máximo {@link http://en.wikipedia.org/wiki/Group_delay_and_phase_delay group delay}, ou seja, a frequência onde o centro da fase de transição ocorre.
		 * - `Q` - Controla o quão apurada a transição é na frequência média. Quanto maior este parâmetro, mais apurada e ampla será a transição.
		 * - `gain` - Não aplicado.
		 */
		ALLPASS = 'allpass'
	}
}

export default BiquadFilter