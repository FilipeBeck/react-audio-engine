import 'vanilla-x/Object'
import React from 'react'
import ReactDOM from 'react-dom'
import * as ATOM from '../../../src/atom'
import Event from '../../../src/toolkit/Event'
import { BufferSource, Scene } from '../../../src/reconciler/Components'
import { RouteComponentProps } from '@reach/router'
import AudioView from '../AudioView'
import { Waveloscope } from './components/audio/Waveloscope'

require('./AudioAnalyzer.scss')

const audioURL = require('./assets/viper.mp3').default as string

class AudioAnalyser extends AudioView<AudioAnalyser.Props, AudioAnalyser.State> {
	public state: AudioAnalyser.State = {
		timeDomainData: new Uint8Array(),
		analyzer: null,
		isLoading: false,
		scene: {
			active: false,
		},
		audioURL: ''
	}

	public renderAudio() {
		return <Scene
			active={this.state.scene.active}
			latencyHint={this.state.scene.latencyHint}
			sampleRate={this.state.scene.sampleRate}
		>
			<BufferSource start={true} buffer={this.state.buffer} loop={true}>
				<Waveloscope onAudioProcess={this.xBind('processAudioScript')} />
			</BufferSource>
		</Scene>
	}

	public assignAnalyzerRef(analyzer: ATOM.Analyser | null): void {
		this.setState({ analyzer })
	}

	public processAudioScript(timeDomainData: Uint8Array): void {
		this.setState({ timeDomainData })
	}

	public renderView() {
		return <div className="AudioAnalyzer">
			<canvas id="canvas" width="512" height="256" ></canvas>

			<nav className="controls">
				<div>
					<button className="start-button" onClick={this.xBind('play')}>Start</button>
					<button type="button" className="stop-button" onClick={this.xBind('stop')}>Stop</button>
				</div>
				<div className="file-select">
					<button onClick={this.xBind('selectFile')}>Select audio file</button>
					<span>{this.state.audioURL || audioURL}</span>
				</div>
				<form action="" onSubmit={event => {
					event.preventDefault()
					
					const inputs = (event.target as HTMLFormElement).elements
					const scene = { ...this.state.scene } as Record<string, number>

					for (const input of inputs) {
						if (input instanceof HTMLInputElement) {
							scene[input.name] = parseFloat(input.value)
						}
					}

					this.setState({ scene })
				}}>
					<label>
						<span>Latency Hint</span>
						<input
							type="number"
							name="latencyHint"
							defaultValue="0.01"
							// value={this.state.scene.latencyHint}
							// onChange={event => this.setState({ scene: { ...this.state.scene, latencyHint: event.target.value as any } })}
						/>
					</label>
					<label>
						<span>Sample Rate</span>
						<input
							type="number"
							name="sampleRate"
							defaultValue="44100"
							// value={this.state.scene.sampleRate}
							// onChange={event => this.setState({ scene: { ...this.state.scene, sampleRate: event.target.value as any } })}
						/>
					</label>
					<button type="submit">Apply</button>
				</form>
				<p className="msg">{this.state.isLoading && 'Loading audio...'}</p>
			</nav>
		</div>
	}

	public selectFile(_event: Event<HTMLInputElement>): void {
		const fileSelect = document.createElement('input')
		const fileReader = new FileReader()

		fileSelect.type = 'file'
		fileSelect.multiple = false

		fileSelect.onchange = () => {
			const files = fileSelect.files

			if (!files) {
				return
			}

			const file = files[0]

			this.setState({ isLoading: true })

			fileReader.onload = () => {
				this.setState({ buffer: fileReader.result as ArrayBuffer, audioURL: file.name, isLoading: false })
			}

			fileReader.onerror = () => {
				this.setState({ isLoading: false })
				console.log(fileReader.error)
				alert(fileReader.error?.message ?? 'Não foi possível carregar o arquivo')
			}

			fileReader.readAsArrayBuffer(file)
		}

		fileSelect.click()
	}

	public play(): void {
		if (this.state.isLoading || this.state.scene.active) {
			return
		}
		else if (this.state.buffer) {
			this.setState({ scene: { ...this.state.scene, active: true } })
		}
		else {
			this.setState({ isLoading: true })

			const request = new XMLHttpRequest();
			request.open('GET', audioURL, true);
			request.responseType = 'arraybuffer';
			// When loaded, decode the data and play the sound
			request.onload = () => {
				this.setState({ buffer: request.response as ArrayBuffer, scene: { ...this.state.scene, active: true }, isLoading: false })
			}
			request.send()
		}
	}

	public stop(): void {
		this.setState({ scene: { ...this.state.scene, active: false } })
	}

	public componentDidUpdate(): void {
		super.componentDidUpdate()
		const context = (ReactDOM.findDOMNode(this) as HTMLDivElement | null)?.querySelector('canvas')?.getContext('2d')

		if (context) {
			requestAnimationFrame(() => {
				const canvasWidth = context.canvas.width
				const canvasHeight = context.canvas.height
				const amplitudeArray = this.state.timeDomainData

				context.clearRect(0, 0, canvasWidth, canvasHeight);
				context.moveTo(0, amplitudeArray[0] / 256)
				context.strokeStyle = '#fafffa'
				context.beginPath()
				for (let i = 0; i < amplitudeArray.length; i++) {
					let value = amplitudeArray[i] / 256;
					let y = canvasHeight - (canvasHeight * value) - 1;
					context.lineTo(i, y)
				}
				context.stroke()
			})
		}
	}
}
namespace AudioAnalyser {
	export type Props  = RouteComponentProps

	export interface State {
		timeDomainData: Uint8Array
		buffer?: ArrayBuffer
		analyzer: ATOM.Analyser | null
		isLoading: boolean
		scene: Scene.Props
		audioURL: string
	}
}

export default AudioAnalyser