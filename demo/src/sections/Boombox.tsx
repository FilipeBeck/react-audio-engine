import 'vanilla-x/Object'
import React from 'react'
import Event from '../../../src/toolkit/Event'
import { BiquadFilter, Gain, MediaElementSource, Scene, StereoPanner } from '../../../src/reconciler/Components'
import { RouteComponentProps } from '@reach/router'
import AudioView from '../AudioView'
import { ATOM } from '../../../src'

require('./Boombox.scss')

const audioURL = require('./assets/outfoxing.mp3').default as string

class Boombox extends AudioView<Boombox.Props, Boombox.State> {
	public state: Boombox.State = {
		audioElement: null,
		gainLevel: 1,
		pan: 0,
		isOn: false,
		isPlaying: false,
		filter: {
			on: false,
			frequency: 350,
			detune: 0,
			Q: 1,
			gain: 0,
			type: ATOM.BiquadFilter.Type.LOWPASS,
		},
	}

	public renderAudio() {
		const { audioElement, filter } = this.state

		return <Scene active={this.state.isOn}>
			{audioElement && this.state.isPlaying && <>
				<MediaElementSource element={audioElement} />
				{filter.on && <BiquadFilter
					frequency={filter.frequency}
					detune={filter.detune}
					Q={filter.Q}
					gain={filter.gain}
					type={filter.type}
				/>}
				<Gain level={this.state.gainLevel} />
				<StereoPanner pan={this.state.pan} />
			</>}
		</Scene>
	}

	public renderView() {
		const filter = this.state.filter

		return <div className="Boombox">
			<div className="handle"/>
			<div className="body">
				<section className="filter">
					<div className="title">
						<span>Biquad Filter</span>
						<input type="checkbox"
							value={filter.on.toString()}
							onChange={() => this.setState({ filter: { ...filter, on: !filter.on } })}
						/>
					</div>
					<div className="body">
						<label className="frequency">
							<span>Frequency</span>
							<input type="range"
								disabled={!filter.on}
								min={10}
								max={22000}
								value={filter.frequency}
								onChange={event => this.setState({ filter: { ...filter, frequency: parseFloat(event.target.value) } })}
							/>
						</label>
						<label className="detune">
							<span>Detune</span>
							<input type="range"
								disabled={!filter.on}
								min={0}
								max={100}
								value={filter.detune}
								onChange={event => this.setState({ filter: { ...filter, detune: parseFloat(event.target.value) } })}
							/>
						</label>
						<label className="q">
							<span>Q</span>
							<input type="range"
								disabled={!filter.on}
								min={0.0001}
								max={1000}
								value={filter.Q}
								onChange={event => this.setState({ filter: { ...filter, Q: parseFloat(event.target.value) } })}
							/>
						</label>
						<label className="gain">
							<span>Gain</span>
							<input type="range"
								disabled={!filter.on}
								min={-40}
								max={40}
								value={filter.gain}
								onChange={event => this.setState({ filter: { ...filter, gain: parseFloat(event.target.value) } })}
							/>
						</label>
						<label className="type">
							<span>Type</span>
							<select
								disabled={!filter.on}
								value={filter.type}
								onChange={event => this.setState({ filter: { ...filter, type: event.target.value as ATOM.BiquadFilter.Type } })}
							>
								<option value="lowpass">LOWPASS</option>
								<option value="highpass">HIGHPASS</option>
								<option value="bandpass">BANDPASS</option>
								<option value="lowshelf">LOWSHELF</option>
								<option value="highshelf">HIGHSHELF</option>
								<option value="peaking">PEAKING</option>
								<option value="notch">NOTCH</option>
								<option value="allpass">ALLPASS</option>
							</select>
						</label>
					</div>
				</section>
				<section className="master-controls">
					<input
						id="volume"
						type="range"
						className="control-volume"
						min="0"
						max="2"
						value={this.state.gainLevel}
						list="gain-vals"
						step="0.01"
						onChange={this.xBind('changeGain')}
					/>
					<datalist id="gain-vals">
						<option value="0" label="min"/>
						<option value="2" label="max"/>
					</datalist>
					<label htmlFor="volume">VOL</label>
					<input
						id="panner"
						type="range"
						className="control-panner"
						list="pan-vals"
						min="-1"
						max="1"
						value={this.state.pan}
						step="0.01"
						onChange={this.xBind('changePan')}
					/>
					<datalist id="pan-vals">
						<option value="-1" label="left"/>
						<option value="1" label="right"/>
					</datalist>
					<label htmlFor="panner">PAN</label>
					<button
						className="control-power"
						role="switch"
						aria-checked="false"
						style={{ backgroundColor: this.state.isOn && '#085' || '#a20' }}
						onClick={this.xBind('toggleOn')}
					>
						<span>{this.state.isOn && 'On' || 'Off'}</span>
					</button>
				</section>
				<section className="tape">
					<audio ref={this.xBind('assignAudioElement')} src={audioURL} crossOrigin="anonymous" ></audio>
					<button disabled={!this.state.isOn} className="tape-controls-play" role="switch" aria-checked="false" onClick={this.xBind('togglePlaying')}>
						<span>{this.state.isPlaying && 'Pause' || 'Play'}</span>
					</button>
				</section>
			</div>
		</div>
	}

	public assignAudioElement(audioElement: HTMLAudioElement | null): void {
		this.setState({ audioElement })
	}

	public changeGain(event: Event<HTMLInputElement>): void {
		this.setState({ gainLevel: parseFloat(event.target.value) })
	}

	public changePan(event: Event<HTMLInputElement>): void {
		this.setState({ pan: parseFloat(event.target.value) })
	}

	public toggleOn(): void {
		const isOn = !this.state.isOn

		this.setState({ isOn, isPlaying: this.state.isPlaying && isOn })
	}

	public togglePlaying(): void {
		if (this.state.isOn) {
			this.setState({ isPlaying: !this.state.isPlaying })
		}
	}

	public componentDidUpdate(): void {
		super.componentDidUpdate()
		const audioElement = this.state.audioElement

		if (audioElement) {
			this.state.isPlaying ? audioElement.play() : audioElement.pause()
		}
	}
}
namespace Boombox {
	export type Props = RouteComponentProps

	export interface State {
		audioElement: HTMLAudioElement | null
		gainLevel: number
		pan: number
		isOn: boolean
		isPlaying: boolean
		filter: Filter
	}

	export interface Filter {
		on: boolean
		frequency: number
		detune: number
		Q: number
		gain: number
		type: ATOM.BiquadFilter.Type
	}
}

export default Boombox