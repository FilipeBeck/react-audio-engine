import 'vanilla-x/Object'
import React from 'react'
import Event from '../../../src/toolkit/Event'
import { BufferSource, Gain, Mixer, Scene, Track, Record } from '../../../src/reconciler/Components'
import { Link, RouteComponentProps } from '@reach/router'
import { AudioView } from '../../../src'
import Wave from './components/view/Wave'
import { Button, Slider, Typography } from '@material-ui/core'
import * as Icon from '@material-ui/icons'

require('./MultiTrack.scss')

const audioFiles = [
	require('./assets/leadguitar.mp3').default as string,
	require('./assets/bassguitar.mp3').default as string,
	require('./assets/drums.mp3').default as string,
	require('./assets/horns.mp3').default as string,
	require('./assets/clav.mp3').default as string,
]

class MultiTrack extends AudioView<MultiTrack.Props, MultiTrack.State> {
	public override state: MultiTrack.State = {
		tracks: ['Lead Guitar', 'Bass Guitar', 'Drums', 'Horns', 'Clav'].map(name => ({
			name,
			buffer: null,
			audioBuffer: null,
			gain: 1,
			loadingForScene: false,
			loadingForRecord: false,
		})),
		masterGain: 1,
		recordBuffer: null,
		isActive: false,
	}

	public renderAudio() {
		const { tracks, masterGain } = this.state
		const recordKey = tracks.filter(track => track.buffer).map(track => track.gain).concat(masterGain).join('-')

		return <>
			<Scene active={this.state.isActive}>
				<Mixer>
					{tracks.map((track, i) => track.buffer && (
						<Track key={audioFiles[i]}>
							<BufferSource
								start={track.buffer !== null && (context => ({ when: 0, offset: context.currentTime }))}
								buffer={track.buffer}
								onLoaded={() => this.handleSceneSourceLoad(i)}
							/>
							<Gain level={track.gain} />
						</Track>
					))}
				</Mixer>
				<Gain level={masterGain} />
			</Scene>
			<Record
				key={recordKey}
				active={this.state.tracks.filter(t => t.buffer).every(t => !t.loadingForRecord)}
				length={85}
				onComplete={this.xBind('handleRecordCompletion')}
			>
				<Mixer>
					{tracks.map((track, i) => track.buffer && (
						<Track key={audioFiles[i]}>
							<BufferSource
								start={true}
								buffer={track.buffer}
								onLoading={() => this.handleRecordSourceLoading(i)}
								onLoaded={() => this.handleRecordSourceLoaded(i)}
							/>
							<Gain level={track.gain} />
						</Track>
					))}
				</Mixer>
				<Gain level={masterGain} />
			</Record>
		</>
	}

	public handleSceneSourceLoad(index: number): void {
		const tracks = [...this.state.tracks]

		tracks[index]!.loadingForScene = false
		this.setState({ tracks })
	}

	public handleRecordSourceLoading(index: number): void {
		const tracks = [...this.state.tracks]

		tracks[index]!.loadingForRecord = true
		this.setState({ tracks })
	}

	public handleRecordSourceLoaded(index: number): void {
		const tracks = [ ...this.state.tracks]

		tracks[index]!.loadingForRecord = false
		this.setState({ tracks })
	}

	public handleRecordCompletion(event: OfflineAudioCompletionEvent): void {
		this.setState({ recordBuffer: event.renderedBuffer.getChannelData(0) })
		// const canvas = (ReactDOM.findDOMNode(this) as HTMLDivElement | null)?.querySelector('canvas.wave') as HTMLCanvasElement | null
		// const context = canvas?.getContext('2d')

		// if (context) {
		// 	const buffer = event.renderedBuffer
		// 	const { width, height } = canvas!
		// 	const ax = width / buffer.length
		// 	const ay = height / 2

		// 	context.clearRect(0, 0, width, height)
		// 	context.lineWidth = 1
		// 	context.strokeStyle = '#003'

		// 	if (buffer.numberOfChannels >= 1) {
		// 		context.beginPath()
		// 		context.moveTo(0, ay)

		// 		const data = buffer.getChannelData(0)

		// 		for (let i = 0, count = data.length; i < count; i += 100) {
		// 			context.lineTo(i * ax, ay + data[i] * ay)
		// 		}

		// 		context.stroke()
		// 	}
 		// }
	}

	public renderView() {
		return <div className="MultiTrack">
			<div className="master-controls">
				<Button
					className="start"
					variant="outlined"
					onClick={this.xBind('start')}
					disabled={this.state.isActive}
				>
					{!this.state.isActive && 'Resume context' || 'Context resumed'}
				</Button>
				<Slider
					className="gain"
					min={0}
					max={3}
					value={this.state.masterGain}
					step={0.01}
					onChange={this.xBind('changeMasterGain')}
				/>
			</div>
			<div className="wrapper">
				<section className="tracks">
					<ul>
						{this.state.tracks.map((track, i) => <li key={audioFiles[i]}>
							<Link to={audioFiles[i]!} className="track" target="new">
								<Typography>{track.name}</Typography>
							</Link>
							<Slider
								className="gain"
								min={0}
								max={3}
								value={track.gain}
								step={0.01}
								onChange={(_event, value) => this.changeGain(value as number, i)}
							/>
							<Button
								className="play"
								variant="outlined"
								data-audio-index={i}
								onClick={this.xBind('processTrack')}
								disabled={!this.state.isActive}
							>
								{track.loadingForScene ? <Icon.LoopRounded/> : track.buffer && this.state.isActive && 'Stop' || 'Play'}
							</Button>
						</li>)}
					</ul>
					{this.state.recordBuffer && (
						<Wave
							canvas={{ className: 'wave' }}
							buffer={{
								data: this.state.recordBuffer
							}}
						/>
					)}
					<p className="sourced">All tracks sourced from <a href="http://jplayer.org/">jplayer.org</a></p>
				</section>
			</div>
		</div>
	}

	public start() {
		this.setState({ isActive: true })
	}

	public changeMasterGain(_event: Event<HTMLInputElement>, value: number): void {
		this.setState({ masterGain: value })
	}

	public changeGain(value: number, index: number): void {
		const tracks = this.state.tracks.slice()
		tracks[index]!.gain = value

		this.setState({ tracks })
	}

	public processTrack(event: Event<HTMLButtonElement>) {
		const audioIndex = parseInt(event.currentTarget!.getAttribute('data-audio-index') as string)
		let tracks = this.state.tracks.slice()
		const track = tracks[audioIndex]!

		if (!track.loadingForScene) {
			if (track.buffer) {
				track.buffer = null

				this.setState({ tracks })
			}
			else {
				track.loadingForScene = true
				this.setState({ tracks })

				const request = new XMLHttpRequest()

				request.open('GET', audioFiles[audioIndex]!, true);
				request.responseType = 'arraybuffer';
				request.onload = () => {
					tracks = tracks.slice()
					track.buffer = request.response
					this.setState({ tracks })
				}
				request.send()
			}
		}
	}
}
namespace MultiTrack {
	export type Props = RouteComponentProps

	export interface State {
		tracks: Track[],
		isActive: boolean
		masterGain: number
		recordBuffer: Float32Array | null
	}

	export interface Track {
		name: string
		buffer: ArrayBuffer | null
		gain: number
		loadingForScene: boolean
		loadingForRecord: boolean
	}
}

export default MultiTrack
