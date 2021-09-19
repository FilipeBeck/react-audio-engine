import React, { ReactElement } from 'react'
import { ATOM } from '../../src'
import { Renderer as ReactATOM } from '../../src/reconciler'
import QueuedMemoizedRunner from '../../src/toolkit/QueuedMemoizedRunner'

abstract class AudioView<$Props = {}, $State = {}> extends React.Component<$Props, $State> {
	public static Context = React.createContext<AudioView.ContextType>({})
	public static override contextType = AudioView.Context

	private stage?: ATOM.Stage

	constructor(props: $Props) {
		super(props)
		QueuedMemoizedRunner.setImmediate(() => {
			this.updateAudio()
		})
	}

	public override render() {
		return this.renderView()
	}

	public override componentDidUpdate(): void {
		this.updateAudio()
	}

	public override componentWillUnmount(): void {
		const stage = this.context.stage || this.stage

		if (stage) {
			ReactATOM.render(<React.Fragment />, stage)
		}
	}

	public abstract renderAudio(): ReactElement
	public abstract renderView(): ReactElement

	private updateAudio(): void {
		const stage = this.context.stage || this.stage || (this.stage = new ATOM.Stage())
		ReactATOM.render(this.renderAudio(), stage)
	}
}
namespace AudioView {
	export interface ContextType {
		stage?: ATOM.Stage
	}
}

export default AudioView
