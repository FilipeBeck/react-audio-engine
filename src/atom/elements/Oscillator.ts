import Jack from '../Jack'
import ScheduledSource from './ScheduledSource'
/**
 * representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode `OscillatorNode`}.
 */
class Oscillator extends ScheduledSource<OscillatorNode, Oscillator.Attributes> {
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected get attributesConstructionKeys(): Array<keyof Oscillator.Attributes> {
		return ['periodicWave']
	}
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): OscillatorNode {
		const node = this.context!.createOscillator()

		const periodicWave = this.attributes.periodicWave

		if (periodicWave) {
			node.setPeriodicWave(this.context!.createPeriodicWave(periodicWave.real || [], periodicWave.imag || [], periodicWave))
		}

		return node
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Oscillator.Attributes>(name: $Name, value: Oscillator.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'frequency': case 'detune':
				this.applyParameterization(name as keyof typeof node, value as Jack.Parameterization);
			break

			case 'type':
				node.type = value as Oscillator.Type
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace Oscillator {
	/**
	 * Atributos de `Oscillator`.
	 */
	export interface Attributes extends ScheduledSource.Attributes {
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a frequência de oscilação em _hertz_.
		 * @default 440
		 */
		frequency?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a dessintonização da oscilação em {@link https://en.wikipedia.org/wiki/Cent_(music) cents}.
		 * @default 0
		 */
		detune?: Jack.Parameterization
		/**
		 * Uma {@link https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave onda periódica} que será usada no lugar das formas de ondas padrões. Se definido, o tatributo `type` será ignorado e estabelecido como `CUSTOM`.
		 */
		periodicWave?: PeriodicWave
		/**
		 * Formato da onda. Se `periodicWave` for definido, o atributo é ignorado e estabelecido como `CUSTOM`.
		 * @default SINE
		 */
		type?: Type
	}
	/**
	 * Tipo de onda.
	 */
	export const enum Type {
		/**
		 * Senoidal.
		 */
		SINE = 'sine',
		/**
		 * Quadrada.
		 */
		SQUARE = 'square',
		/**
		 * Dente de serra.
		 */
		SAWTOOTH = 'sawtooth',
		/**
		 * Triangular.
		 */
		TRIANGLE = 'triangle',
		/**
		 * Customizada.
		 */
		CUSTOM = 'custom'
	}
	/**
	 * Propriedades de uma onda periódica.
	 */
	export type PeriodicWave = PeriodicWaveOptions
}

export default Oscillator