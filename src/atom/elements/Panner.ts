import Element from './Element'
import Jack from '../Jack'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/PannerNode `PannerNode`}.
 */
class Panner extends Element<PannerNode, Panner.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): PannerNode {
		return this.context!.createPanner()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof Panner.Attributes>(name: $Name, value: Panner.Attributes[$Name]): void {
		const node = this.node!

		switch (name) {
			case 'coneInnerAngle': node.coneInnerAngle = value as number ?? 360;                                        break
			case 'coneOuterAngle': node.coneOuterAngle = value as number ?? 360;                                        break
			case 'coneOuterGain':  node.coneOuterGain = value as number ?? 0;                                           break
			case 'distanceModel':  node.distanceModel = value as Panner.DistanceModel ?? Panner.DistanceModel.INVERSE;  break
			case 'maxDistance':    node.maxDistance = value as number ?? 10_000;                                        break
			case 'panningModel':   node.panningModel = value as Panner.PanningModel ?? Panner.PanningModel.EQUAL_POWER; break
			case 'refDistance':    node.refDistance = value as number ?? 1;                                             break
			case 'rolloffFactor':  node.rolloffFactor = value as number ?? 1;                                           break

			case 'orientationX': case 'orientationY': case 'orientationZ': case 'positionX': case 'positionY': case 'positionZ':
				this.applyParameterization(name, value as Jack.Parameterization)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace Panner {
	/**
	 * Atributos de `Panner`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Ângulo, em graus, de um cone dentro do qual não haverá redução de volume.
		 * @default 360
		 */
		coneInnerAngle?: number
		/**
		 * Ãngulo, em graus, fora do qual o volume será reduzido por um valor constante definido por `coneOuterAngle`.
		 * @default 360
		 */
		coneOuterAngle?: number
		/**
		 * Nível de volume fora do cone definido por `coneOuterAngle`.
		 * @default 0
		 */
		coneOuterGain?: number
		/**
		 * Algoritmo usado para reduzir o volume da fonte de áudio na medida que `listener` se afasta.
		 * @default INVERSE
		 */
		distanceModel?: Panner.DistanceModel
		/**
		 * Distância máxima entrea  fonte de áudio e `listener` acima da qual o volume não será mais reduzido.
		 * @default 10000
		 */
		maxDistance?: number
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} que representa a posição horizontal do vetor da fonte de áudio em um sistema de coordenadas cartesianas.
		 * @default 1
		 */
		orientationX?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} que representa a posição vertical do vetor da fonte de áudio em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		orientationY?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} que representa a posição longitudinal do vetor da fonte de áudio em um sistema de coordenadas cartesianas.
		 * @default 0
		 */
		orientationZ?: Jack.Parameterization
		/**
		 * Algoritmo de espacialização.
		 * @default EQUAL_POWER
		 */
		panningModel?: Panner.PanningModel
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a posição horizontal do áudio no plano cartesiano.
		 * @default 0
		 */
		positionX?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a posição vertical do áudio no plano cartesiano.
		 * @default 0
		 */
		positionY?: Jack.Parameterization
		/**
		 * Parâmetro do tipo {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate a-rate} representando a posição logitudinal do áudio no plano cartesiano.
		 * @default 0
		 */
		positionZ?: Jack.Parameterization
		/**
		 * Distância de referência usada para reduzir o volume na medida que a fonte de áudio se afasta de `listener`. Para distâncias maiores do que essa o volume será reduzido baseado em `rolloffFactor` e `distanceModel`.
		 * @default 1
		 */
		refDistance?: number
		/**
		 * Define o quão rápido o volume é reduzido na medida em que a fonte de áudio se distancia de `listener`. Este valor é usado por todos os modelos de distância.
		 * @default 1
		 */
		rolloffFactor?: number
	}
	/**
	 * Algoritmo usado na redução de volume de acordo com a distância de `listener`.
	 */
	export const enum DistanceModel {
		/**
		 * Um _modelo de distância linear_ que calcula o ganho induzido de acordo com: `1 - rolloffFactor * (distance - refDistance) / (maxDistance - refDistance)`.
		 */
		LINEAR = 'linear',
		/**
		 * Um _modelo de distância inverso_ que calcula o ganho de acordo com: `refDistance / (refDistance + rolloffFactor * (Math.max(distance, refDistance) - refDistance))`.
		 */
		INVERSE = 'inverse',
		/**
		 * Um _modelo de distância exponencial_  que calcula o ganho de acordo com: `pow((Math.max(distance, refDistance) / refDistance, -rolloffFactor)`.
		 */
		EXPONENTIAL = 'exponential',
	}
	/**
	 * Algoritmo de espacialização usado para posicionar o áudio no espaço 3D.
	 */
	export const enum PanningModel {
		/**
		 * Um algoritmo _equal power_, geralmente considerado simples e eficiente.
		 */
		EQUAL_POWER = 'equalpower',
		/**
		 * Renderiza uma saída _stereo_  de qualidade superior à `EQUAL_POWER`. Usa uma {@link https://en.wikipedia.org/wiki/Convolution convolução} com medidas de resposta ao impulso retiradas de seres humanos.
		 */
		HRTF = 'HRTF',
	}
}

export default Panner
