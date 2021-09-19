import 'vanilla-x/Object'
import React from 'react'
import Event from '../../../src/toolkit/Event'
import { BiquadFilter, Gain, MediaElementSource, Scene, StereoPanner } from '../../../src/reconciler/Components'
import { RouteComponentProps } from '@reach/router'
import AudioView from '../AudioView'
import { ATOM } from '../../../src'
import { Button, Checkbox, Slider, TextField, Typography } from '@material-ui/core'

require('./Boombox.scss')

const audioURL = require('./assets/outfoxing.mp3').default as string

class Boombox extends AudioView<Boombox.Props, Boombox.State> {
	public override state: Boombox.State = {
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
						<Typography>Biquad Filter</Typography>
						<Checkbox
							value={filter.on.toString()}
							onChange={() => this.setState({ filter: { ...filter, on: !filter.on } })}
						/>
					</div>
					<div className="body">
						<label className="frequency">
							<span>Frequency</span>
							<Slider
								disabled={!filter.on}
								min={10}
								max={22000}
								value={filter.frequency}
								onChange={(_event, value) => this.setState({ filter: { ...filter, frequency: value as number } })}
							/>
						</label>
						<label className="detune">
							<span>Detune</span>
							<Slider
								disabled={!filter.on}
								min={0}
								max={100}
								value={filter.detune}
								onChange={(_event, value) => this.setState({ filter: { ...filter, detune: value as number } })}
							/>
						</label>
						<label className="q">
							<span>Q</span>
							<Slider
								disabled={!filter.on}
								min={0.0001}
								max={1000}
								value={filter.Q}
								onChange={(_event, value) => this.setState({ filter: { ...filter, Q: value as number } })}
							/>
						</label>
						<label className="gain">
							<span>Gain</span>
							<Slider
								disabled={!filter.on}
								min={-40}
								max={40}
								value={filter.gain}
								onChange={(_event, value) => this.setState({ filter: { ...filter, gain: value as number } })}
							/>
						</label>
						<TextField
							variant="outlined"
							label="Type"
							select={true}
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
						</TextField>
					</div>
				</section>
				<section className="master-controls">
					<div>
						<Slider
							id="volume"
							className="control-volume"
							min={0}
							max={2}
							value={this.state.gainLevel}
							step={0.01}
							onChange={this.xBind('changeGain')}
						/>
						<label htmlFor="volume">VOL</label>
					</div>
					<div>
						<Slider
							id="panner"
							className="control-panner"
							min={-1}
							max={1}
							value={this.state.pan}
							step={0.01}
							onChange={this.xBind('changePan')}
						/>
						<label htmlFor="panner">PAN</label>
					</div>
					<Button
						className="control-power"
						style={{ backgroundColor: this.state.isOn && '#085' || '#a20' }}
						onClick={this.xBind('toggleOn')}
					>
						<Typography>{this.state.isOn && 'On' || 'Off'}</Typography>
					</Button>
				</section>
				<section className="tape">
					<audio ref={this.xBind('assignAudioElement')} src={audioURL} crossOrigin="anonymous" ></audio>
					<Button
						variant="outlined"
						disabled={!this.state.isOn}
						className="tape-controls-play"
						role="switch"
						aria-checked="false"
						onClick={this.xBind('togglePlaying')}
					>
						<Typography>{this.state.isPlaying && 'Pause' || 'Play'}</Typography>
					</Button>
				</section>
			</div>
		</div>
	}

	public assignAudioElement(audioElement: HTMLAudioElement | null): void {
		this.setState({ audioElement })
	}

	public changeGain(_event: Event<HTMLInputElement>, value: number): void {
		this.setState({ gainLevel: value })
	}

	public changePan(_event: Event<HTMLInputElement>, value: number): void {
		this.setState({ pan: value })
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

	public override componentDidUpdate(): void {
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
