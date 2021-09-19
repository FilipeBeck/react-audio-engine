import React, { ReactElement } from 'react'
import { ATOM } from '../../src'
import { Renderer as ReactATOM } from '../../src/reconciler'
/**
 * Componente utilizado para renderizar o áudio e view de forma unificada. Qualquer atualização no estado desencadeia uma atualização tanto no áudio quanto na view.
 */
abstract class AudioView<$Props = {}, $State = {}> extends React.Component<$Props, $State> {
	/**
	 * Contexto utilizado para acessar o `stage`.
	 */
	public static Context = React.createContext<AudioView.ContextType>({})
	/**
	 * Usado para acessar o contexto.
	 */
	public static override contextType = AudioView.Context
	/**
	 * Especializa o tipo de `context`.
	 */
	public override context!: React.ContextType<typeof AudioView.Context>
	/**
	 * Raiz da árvore de áudio. Pode ser fornecido via contexto. Se não fornecido, será criado um.
	 */
	private stage?: ATOM.Stage
	/**
	 * Alias para `render`. Apenas para deixar simétrico com `renderAudio`.
	 * @returns Elemento react.
	 */
	public override render() {
		return this.renderView()
	}
	/**
	 * Efetua a primeira renderização do áudio assim que a view estiver montada.
	 */
	public override componentDidMount() {
		this.updateAudio()
	}
	/**
	 * Atualiza o áudio após atualizar a view.
	 */
	public override componentDidUpdate(): void {
		this.updateAudio()
	}
	/**
	 * Renderiza um elemento "vazio" antes da view ser desmontada para evitar que áudio continue rodando.
	 */
	public override componentWillUnmount(): void {
		const stage = this.context.stage || this.stage

		if (stage) {
			ReactATOM.render(<React.Fragment />, stage)
		}
	}
	/**
	 * Renderiza o áudio.
	 */
	public abstract renderAudio(): ReactElement
	/**
	 * Renderiza a view.
	 */
	public abstract renderView(): ReactElement
	/**
	 * Atualiza o áudio. É usado o `stage` fornecido pelo contexto. Se o contexto não for fornecido, será criado um `stage`.
	 */
	private updateAudio(): void {
		const stage = this.context.stage || this.stage || (this.stage = new ATOM.Stage())

		ReactATOM.render(this.renderAudio(), stage)
	}
}
namespace AudioView {
	/**
	 * Propriedades do contexto.
	 */
	export interface ContextType {
		stage?: ATOM.Stage
	}
}

export default AudioView
