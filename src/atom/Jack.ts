import Branch from './Branch'
import Module from './Module'
import QueuedBatchRunner from '../toolkit/QueuedBatchRunner'
/**
 * Representa um módulo que contém um nó para um elemento de áudio nativo, podendo ser um descendente de `BaseAudioContext` ou `AudioNode`.
 */
abstract class Jack<$Node, $Attributes extends Module.Attributes> extends Branch<$Attributes> {
	/**
	 * Aplica uma parametrização no parâmetro especificado.
	 * @param context Contexto de áudio fornecido como argumento, caso a parametrização seja funcional.
	 * @param audioParam Parâmetro onde a parametrização será aplicada.
	 * @param parameterization Parametrização a ser aplicada.
	 */
	protected static applyParameterization(context: BaseAudioContext, audioParam: AudioParam, parameterization?: Jack.Parameterization) {
		if (typeof parameterization === 'function') {
			parameterization = parameterization(context, audioParam)
		}

		if (parameterization === Jack.Parameterization.KEEP) {
			return
		}

		audioParam.cancelScheduledValues(context.currentTime)

		if (parameterization === undefined) {
			return
		}

		if (!Array.isArray(parameterization)) {
			parameterization = [parameterization]
		}

		for (const descriptor of parameterization) {
			if (typeof descriptor === 'number') {
				audioParam.value = descriptor
			}
			else {
				switch (descriptor.type) {
					case 'simple':      audioParam.setValueAtTime(descriptor.value, descriptor.atTime);                               break
					case 'curve':       audioParam.setValueCurveAtTime(descriptor.values, descriptor.startTime, descriptor.duration); break
					case 'exponential': audioParam.exponentialRampToValueAtTime(descriptor.value, descriptor.endTime);                break
					case 'linear':      audioParam.linearRampToValueAtTime(descriptor.value, descriptor.endTime);                     break
					case 'target':      audioParam.setTargetAtTime(descriptor.value, descriptor.startTime, descriptor.timeConstant);  break
				}
			}
		}
	}
	/**
	 * Instância de `AudioNode` que serve como entrada e saída.
	 */
	public readonly node?: $Node
	/**
	 * Estabelece o atributo com o nome e valor especificados, reconstruindo o nó se o valor não puder ser modificado após a construção do mesmo.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	public setAttribute<$Name extends keyof $Attributes>(name: $Name, value: $Attributes[$Name]): void {
		if (this.node) {
			if (this.attributesConstructionKeys.includes(name)) {
				this.reconstruct()
			}
			else {
				this.applyAttribute(name, value)
			}
		}

		this.attributes[name] = value
	}
	/**
	 * Lista com os nomes de todos os atributos que não podem ser alterados após o nó ser construido.
	 */
	protected abstract get attributesConstructionKeys(): Array<keyof $Attributes>
	/**
	 * Aplica uma parametrização no atributo com o nome especificado.
	 * @param key Nome do atributo.
	 * @param parameterization Parametrização a ser aplicada.
	 */
	protected abstract applyParameterization(key: keyof $Node, parameterization?: Jack.Parameterization): void
	/**
	 * Atualiza o manipulador especificado para o tipo de evento `type`, removendo o antigo manipulador caso seja especificado.
	 * @param type Tipo do evento.
	 * @param newListener Manipulador a ser adicionado.
	 * @param oldListener Manipulador a ser removido.
	 */
	protected abstract updateEventListener(type: string, newListener?: any, oldListener?: any): void
	/**
	 * Reconstrói o nó e atualiza suas conexões.
	 * @param attributes Novas opções para o nó.
	 */
	protected reconstruct() {
		QueuedBatchRunner.run([Jack, this], () => {
			this.disconnect()
			this.refreshNode()
			this.connect()
			this.notifyThreeMutation()
		}, true)
	}
	/**
	 * Cria um novo nó e atualiza seus atributos.
	 */
	protected refreshNode(): void {
		const attributesConstructionKeys = this.attributesConstructionKeys

		for (const key in this.attributes) {
			if (!attributesConstructionKeys.includes(key)) {
				this.setAttribute(key, this.attributes[key])
			}
		}
	}
}
namespace Jack {
	/**
	 * Callback que usa contexto de áudio.
	 */
	export type ContextFC<$Return> = (context: BaseAudioContext) => $Return
	/**
	 * Tipos de parâmetros aplicaveis à instâncias de {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam `AudioParam`}. Se `number`, o valor é aplicado instantaneamente à `AudioParam.value`, caso constrário um método específico de agendamento será invocado de acordo com o tipo. Cada tipo de parâmetro possui propriedades específicas que serão fornecidas para os métodos correspondentes.
	 */
	export type Parameter = (
		number | Parameter.Simple | Parameter.Exponential | Parameter.Linear | Parameter.Target | Parameter.Curve
	)
	export namespace Parameter {
		/**
		 * Parâmetro comum cuja propriedade `value` será estabelecida instantaneamente no momento `atTime` através do método {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueAtTime `setValueAtTime(value, atTime)`}.
		 */
		export interface Simple {
			/**
			 * Tipo simples - a mudança é instantânea.
			 */
			type: 'simple'
			/**
			 * Valor do parâmetro ({@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value `AudioParam.value`}).
			 */
			value: number
			/**
			 * Instante em segundos em que a mudança deverá acontecer.
			 */
			atTime: number
		}
		/**
		 * Parâmetro exponencialmente gradual cuja propriedade `value` atingirá seu valor corrente no momento `endTime` através do método {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/exponentialRampToValueAtTime `exponentialRampToValueAtTime(value, endTime)`}.
		 */
		export interface Exponential {
			/**
			 * Tipo exponencial - a mudança é progressiva.
			 */
			type: 'exponential'
			/**
			 * Valor do parâmetro ({@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value `AudioParam.value`}).
			 */
			value: number
			/**
			 * Instante em segundos em que a progressão deverá terminar.
			 */
			endTime: number
		}
		/**
		 * Parâmetro linearmente gradual cuja propriedade `value` atingirá seu valor corrente no momento `endTime` através do método {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/linearRampToValueAtTime `linearRampToValueAtTime(value, endTime)`}.
		 */
		export interface Linear {
			/**
			 * Tipo linear - a mudança é... linear.
			 */
			type: 'linear'
			/**
			 * Valor do parâmetro ({@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value `AudioParam.value`}).
			 */
			value: number
			/**
			 * Instante em segundos em que a mudança deverá terminar.
			 */
			endTime: number
		}
		/**
		 * Parâmetro exponencial cuja propriedade `value` começará a mudar no momento `startTime` e atingirá seu valor corrente de acordo com `timeConstant` através do método {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime `setTargetAtTime(value, startTime, timeConstant)`}.
		 */
		export interface Target {
			/**
			 * Tipo exponencial - a mudança é progressiva.
			 */
			type: 'target'
			/**
			 * Valor do parâmetro ({@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value `AudioParam.value`}).
			 */
			value: number
			/**
			 * Instante em segundos em que a progressão deverá começar.
			 */
			startTime: number
			/**
			 * Valor em segundos de uma {@link https://webaudio.github.io/web-audio-api/#dom-audioparam-settargetattime aproximação exponencial} para o valor alvo. Quanto maior o valor, mais lenta a transição será.
			 */
			timeConstant: number
		}
		/**
		 * Parâmetro linearmente interpolado seguindo uma curva definida pelos valores em `values` (dimensionados para caber no intervalo `startTime` + `duration`) através do método {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueCurveAtTime `setValueCurveAtTime(values, startTime, duration)`}.
		 */
		export interface Curve {
			/**
			 * Tipo curvilínio - a mudança segue uma curva definida por `values`.
			 */
			type: 'curve'
			/**
			 * Valores para o parâmetro ({@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value `AudioParam.value`}).
			 */
			values: number[]
			/**
			 * Instante em segundos em que a mudança deverá começar.
			 */
			startTime: number
			/**
			 * Duração em segundos da transição. Os valores em `values` são espaçados igualmente ao longo deste valor.
			 */
			duration: number
		}
	}
	/**
	 * Parametrização. Quando for um array, a ordem de aplicação se dá do primeiro ao último elemento. Sempre que uma parametrização for aplicada, a mesma cancelará qualquer aplicação anterior (mesmo que o novo valor seja uma array vazio), a não ser quando o novo valor for `Parameterization.KEEP`.
	 */
	export type Parameterization = (
		Parameterization.Stored | Parameterization.Functional | typeof Parameterization.KEEP
	)
	export namespace Parameterization {
		/**
		 * Parametrização armazenada com valores explícitos.
		 */
		export type Stored = Parameter | Parameter[]
		/**
		 * Parametrização funcional cujo valor de retorno deve ser uma parametrização armazenada.
		 */
		export type Functional = (context: BaseAudioContext, parameter: AudioParam) => Stored
		/**
		 * Representa uma sustentação de parametrização. Quando esse valor for fornecido, nenhum cancelamento será feito em qualquer parametrização já aplicada.
		 */
		export const KEEP = null
	}
}

export default Jack
