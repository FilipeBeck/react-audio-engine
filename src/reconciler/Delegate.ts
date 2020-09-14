import ReactReconciler from 'react-reconciler'
import * as ATOM from '../atom'
import Tag from './Tag'
/**
 * Atributos comuns a todos os elementos.
 */
type DefaultProps = React.PropsWithChildren<ATOM.Module.Attributes>
/**
 * Contexto.
 */
type HostContext = undefined
/**
 * Informações de atualização
 */
interface UpdatePayload {
	/**
	 * Chaves que devem ser atualizadas.
	 */
	keys: string[]
}
/**
 * Delegate.
 */
const Delegate: ReactReconciler.HostConfig<
	Tag, // Type - Nome da tag
	DefaultProps, // Props - Propriedades comuns a todos os elementos
	ATOM.Stage, // Container - Container da árvore
	ATOM.Module, // Instance - Elementos da árvore
	undefined, // TextInstance - Elementos de texto da árvore
	undefined, // HydratableInstance
	ATOM.Module, // PublicInstance - Valor atribuido à `props.ref`
	HostContext, // HostContext
	UpdatePayload, // UpdatePayload
	any, // ChildSet
	any, // TimeoutHandle
	any // NoTimeout
> = {
	/**
	 * Temporary workaround for scenario where multiple renderers concurrently render using the same context objects. E.g. React DOM and React ART on the same page. DOM is the primary renderer; ART is the secondary renderer.
	 */
	isPrimaryRenderer: true,
	/**
	 * Suporta mutações na árvore.
	 */
	supportsMutation: true,
	/**
	 * Não suporta persistência.
	 */
	supportsPersistence: false,
	/**
	 * Não suporta hidratação.
	 */
	supportsHydration: false,
	/**
	 * Essa função parece ser usada pelo reconciliador para agendar atualizações no alvo.
	 */
	now: typeof performance !== 'undefined' && performance.now || Date.now,
	/**
	 * Clear time out.
	 */
	clearTimeout: clearTimeout,
	/**
	 * Set time out.
	 */
	setTimeout: setTimeout,
	/**
	 * No time out.
	 */
	noTimeout: null,
	/**
	 * Retorna o contexto raiz.
	 * @param rootContainerInstance Instância do container raiz.
	 */
	getRootHostContext(_rootContainerInstance: ATOM.Stage): HostContext {
		return undefined
	},
	/**
	 * Retorna o contexto filho de `parentHostContext`.
	 * @param parentHostContext Contexto pai.
	 * @param _type Tag do elemento.
	 * @param _rootContainerInstance Container raiz.
	 */
	getChildHostContext(parentHostContext: HostContext, _type: Tag, _rootContainerInstance: ATOM.Stage): HostContext {
		return parentHostContext
	},
	/**
	 * Retorna a instância pública de `instance` (usado em `ref`).
	 * @param instance
	 */
	getPublicInstance(instance: ATOM.Module): ATOM.Module {
		return instance
	},
	/**
	 * Executa `callback` após o tempo especificado.
	 * @param callback Manipulador de execução.
	 * @param options Delay de execução.
	 */
	scheduleDeferredCallback(callback: () => any, options?: { timeout: number }): any {
		return Delegate.setTimeout(callback, options?.timeout!)
	},
	/**
	 * Cancela a execução de manipulador com o ID especificado.
	 * @param callbackID Identificador do manipulador de execução.
	 */
	cancelDeferredCallback(callbackID: any): void {
		Delegate.clearTimeout(callbackID)
	},
	/**
	 * Determina se os elementos filhos devem ser tratados como texto.
	 * @param type Tipo do elemento.
	 * @param _props Propriedades do elemento.
	 */
	shouldSetTextContent(_type: Tag, _props: DefaultProps): boolean {
		return false
	},
	/**
	 * Cria uma nova instância para o tipo de elemento especificado.
	 * @param type Tag do elemento.
	 * @param props Propriedades do elemento.
	 * @param _rootContainerInstance Container raiz.
	 * @param _hostContext Contexto.
	 * @param _internalInstanceHandle Num sei...
	 */
	createInstance(type: Tag, props: DefaultProps, _rootContainerInstance: ATOM.Stage, _hostContext: HostContext, _internalInstanceHandle: ReactReconciler.OpaqueHandle) {
		props = { ...props }
		delete props.children

		switch (type) {
			case Tag.MIXER:
				return new ATOM.Mixer(props)
			case Tag.BYPASS:
				return new ATOM.Bypass(props)
			case Tag.TRACK:
				return new ATOM.Track(props)
			case Tag.MERGER:
				return new ATOM.Merger(props)
			case Tag.SCENE:
				return new ATOM.Scene(props)
			case Tag.RECORD:
				return new ATOM.Record(props)
			case Tag.ANALYSER:
				return new ATOM.Analyser(props as ATOM.Analyser.Attributes)
			case Tag.BUFFER_SOURCE:
				return new ATOM.BufferSource(props as ATOM.BufferSource.Attributes)
			case Tag.BIQUAD_FILTER:
				return new ATOM.BiquadFilter(props as ATOM.BiquadFilter.Attributes)
			case Tag.CHANNEL_MERGER:
				throw new Error('Not implemented.')
			case Tag.CHANNEL_SPLITTER:
				throw new Error('Not implemented.')
			case Tag.CONSTANT_SOURCE:
				return new ATOM.ConstantSource(props as ATOM.ConstantSource.Attributes)
			case Tag.CONVOLVER:
				return new ATOM.Convolver(props as ATOM.Convolver.Attributes)
			case Tag.DELAY:
				return new ATOM.Delay(props as ATOM.Delay.Attributes)
			case Tag.DYNAMICS_COMPRESSOR:
				return new ATOM.DynamicsCompressor(props as ATOM.DynamicsCompressor.Attributes)
			case Tag.GAIN:
				return new ATOM.Gain(props as ATOM.Gain.Attributes)
			case Tag.IIR_FILTER:
				return new ATOM.IIRFilter(props as ATOM.IIRFilter.Attributes)
			case Tag.MEDIA_ELEMENT_SOURCE:
				return new ATOM.MediaElementSource(props as ATOM.MediaElementSource.Attributes)
			case Tag.MEDIA_STREAM_DESTINATION:
				return new ATOM.MediaStreamDestination(props as ATOM.MediaStreamDestination.Attributes)
			case Tag.MEDIA_STREAM_SOURCE:
				return new ATOM.MediaStreamSource(props as ATOM.MediaStreamSource.Attributes)
			case Tag.OSCILLATOR:
				return new ATOM.Oscillator(props as ATOM.Oscillator.Attributes)
			case Tag.PANNER:
				return new ATOM.Panner(props as ATOM.Panner.Attributes)
			case Tag.WAVE_SHAPER:
				return new ATOM.WaveShaper(props as ATOM.WaveShaper.Attributes)
			case Tag.STEREO_PANNER:
				return new ATOM.StereoPanner(props as ATOM.StereoPanner.Attributes)
			case Tag.WORKLET:
				return new ATOM.Worklet(props as ATOM.Worklet.Attributes)
			case Tag.SCRIPT_PROCESSOR:
				return new ATOM.ScriptProcessor(props as ATOM.ScriptProcessor.Attributes)

			default:
				throw new Error(`Element of type "${type}" not recognized.`)
		}
	},
	/**
	 * Não permite criação de nós de texto.
	 */
	createTextInstance(): never {
		throw new Error('Text instances are not allowed.')
	},
	/**
	 * Adiciona `child` à `parentInstance`.
	 * @param parentInstance Container onde `child` será adicionado.
	 * @param child Instância a ser adicionada em `parentInstance`.
	 */
	appendInitialChild(parentInstance: ATOM.Module, child: ATOM.Module): void {
		parentInstance.appendChild(child)
	},
	/**
	 * Adiciona `child` à `parentInstance`.
	 * @param parentInstance Container onde `child` será adicionado.
	 * @param child Instância a ser adicionada em `parentInstance`.
	 */
	appendChild(parentInstance: ATOM.Module, child: ATOM.Module): void {
		parentInstance.appendChild(child)
	},
	/**
	 * Remove `child` de `parentInstance`.
	 * @param parentInstance Container do qual `child` será removido.
	 * @param child Instância a ser removida de `ParentInstance`.
	 */
	removeChild(parentInstance: ATOM.Module, child: ATOM.Module): void {
		parentInstance.removeChild(child)
	},
	/**
	 * Adiciona `child` diretamente atrás de `beforeChild`.
	 * @param parentInstance Container on `child` será adicionado.
	 * @param child Instância a ser adicionada em `parentInstance`.
	 * @param beforeChild Instância atrás da qual `child` será adicionado.
	 */
	insertBefore(parentInstance: ATOM.Module, child: ATOM.Module, beforeChild: ATOM.Module): void {
		parentInstance.insertChildBefore(child, beforeChild)
	},
	/**
	 * Adiciona a árvore de elementos ao container raiz.
	 * @param container Container onde `child` será adicionado.
	 * @param child Instância a ser adicionada em `container`.
	 */
	appendChildToContainer(container: ATOM.Stage, child: ATOM.Scenario<any>): void {
		container.appendChild(child)
	},
	/**
	 * Remove `child` de `container`.
	 * @param container Container do qual `child` será removido.
	 * @param child Instância a ser removida de `container`.
	 */
	removeChildFromContainer(container: ATOM.Stage, child: ATOM.Scenario<any>): void {
		container.removeChild(child)
	},
	/**
	 * Adiciona `child` diretamente atrás de `beforeChild` no container raiz.
	 * @param parentInstance Container on `child` será adicionado.
	 * @param child Instância a ser adicionada em `parentInstance`.
	 * @param beforeChild Instância atrás da qual `child` será adicionado.
	 */
	insertInContainerBefore(container:ATOM.Stage, child: ATOM.Scenario<any>, beforeChild: ATOM.Scenario<any>) {
		container.insertChildBefore(child, beforeChild)
	},
	/**
	 * Parece ser invocado na finalização da criação dos elementos filhos iniciais.
	 * @param _parentInstance Instância do módulo pai.
	 * @param _type tag do elemento.
	 * @param _props Propriedades do elemento.
	 * @param _rootContainerInstance Container raiz.
	 * @param _hostContext Contexto.
	 */
	finalizeInitialChildren(_parentInstance: ATOM.Module, _type: Tag, _props: DefaultProps, _rootContainerInstance: ATOM.Stage, _hostContext: HostContext): boolean {
		return false
	},
	/**
	 * Invocado logo antes de executar as atualizações na árvore.
	 */
	prepareForCommit(_containerInfo: ATOM.Stage): void {
		return
	},
	/**
	 * Invocado logo após executar as atualizações na árvore.
	 */
	resetAfterCommit(_containerInfo: ATOM.Stage): void {
		return
	},
	/**
	 * Parece ser invocado logo antes (ou depois?) da montagem do módulo.
	 * @param instance Instância do módulo.
	 * @param _type Tag do elemento.
	 * @param _props Propriedades do elemento.
	 * @param _internalInstanceHandle I don't know...
	 */
	commitMount(_instance: ATOM.Module, _type: Tag, _props: DefaultProps, _internalInstanceHandle: ReactReconciler.OpaqueHandle): void {
		return
	},
	/**
	 * Deve retornar um payload indicando que deve ocorrer atualizações no elemento. Se `void`, delega ao reconciliador nativo.
	 */
	prepareUpdate(_instance: ATOM.Module, _type: Tag, oldProps: DefaultProps, newProps: DefaultProps, _rootContainerInstance: ATOM.Stage, _hostContext: HostContext): UpdatePayload | null {
		const allPropKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]) as Set<keyof DefaultProps>
		const payloadKeys = Array<string>()

		for (const key of allPropKeys) {
			if (key !== 'children' && oldProps[key] !== newProps[key]) {
				payloadKeys.push(key)
			}
		}

		return payloadKeys.length && { keys: payloadKeys } || null
	},
	/**
	 * Efetua as atualizações no elemento.
	 * @param instance Instância do módulo.
	 * @param updatePayload Payload com as chaves a serem atualizadas.
	 * @param type Tag do elemento.
	 * @param oldProps Propriedades antigas.
	 * @param newProps Novas propriedades.
	 * @param _internalInstanceHandle Num sei..
	 */
	commitUpdate(instance: ATOM.Module, updatePayload: UpdatePayload, _type: Tag, _oldProps: DefaultProps, newProps: DefaultProps, _internalInstanceHandle: ReactReconciler.OpaqueHandle): void {
		const keys = updatePayload.keys as Array<keyof DefaultProps>

		for (const key of keys) {
			if (key !== 'children') {
				instance.setAttribute(key, newProps[key])
			}
		}
	},
	/**
	 * Como não permite criação de nós de texto, também não permite atualização dos mesmos. Na prática, essa função nunca será invocada.
	 * @param textInstance
	 * @param _oldText
	 * @param newText
	 */
	commitTextUpdate(_textInstance: undefined, _oldText: string, _newText: string): void {
		throw new Error()
	},
	/**
	 * Determina se deve dar prioridade menor para a sub-árvore.
	 * @param _type
	 * @param props
	 */
	shouldDeprioritizeSubtree(_type: Tag, _props: DefaultProps): boolean {
		return false
	},
}

export default Delegate
