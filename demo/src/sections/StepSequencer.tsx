import 'vanilla-x/Object'
import React, { useCallback } from 'react'
import { ATOM } from '../../../src'
import { Mixer, Scene } from '../../../src/reconciler/Components'
import { RouteComponentProps } from '@reach/router'
import AudioView from '../AudioView'
import { SweepPad } from './components/audio/SweepPad'
import { Typography } from '@material-ui/core'

require('./StepSequencer.scss')

const waveTableSource = require('./assets/step-sequencer-periodic-wave.json') as ATOM.Oscillator.PeriodicWave

const waveTable = {
	'real': Float32Array.from(waveTableSource.real!),
	'imag': Float32Array.from(waveTableSource.imag!),
}

const SequencerView: React.FC<SequencerView.Props> = props => {
	const patternLength = props.pattern.length

	const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.currentTarget
		const id = target.getAttribute('data-id')!
		const value = parseFloat(target.value)

		props.onSliderChange(id, value)
	}, [])

	const handlePadChange = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		const step = parseInt(event.currentTarget.parentElement!.getAttribute('data-step') as string)
		const pan = parseInt(event.currentTarget.getAttribute('data-pan') as string) as -1 | 1
		props.onPadChange(step, pan)
	}, [])

	return <div className="SequencerView">
		<div className="title">
			<Typography>{props.name}</Typography>
		</div>
		<div className="sliders">
			{props.sliders.map(slider => <div key={slider.id}>
				<span>{slider.label}</span>
				<input
					data-id={slider.id}
					type="range"
					step={0.01}
					min={slider.min}
					max={slider.max}
					value={slider.value}
					onChange={handleSliderChange}
				/>
			</div>)}
		</div>
		<div className="pad" style={{ gridTemplateColumns: `repeat(${patternLength}, 1fr)`}}>
			{props.pattern.map((flag, step) => (
				<div
					key={step}
					data-step={step}
					data-active={props.isActive && step === (props.step % patternLength)}
				>
					<button data-pan={-1} data-on={flag[0]} onClick={handlePadChange}>L</button>
					<button data-pan={+1} data-on={flag[1]} onClick={handlePadChange}>R</button>
				</div>
			))}
		</div>
	</div>
}
namespace SequencerView {
	export interface Props {
		isActive: boolean
		name: string
		sliders: Slider[]
		pattern: Array<[boolean, boolean]>
		step: number
		onSliderChange(id: string, value: number): void
		onPadChange(step: number, pan: -1 | 1): void
	}

	export interface Slider {
		id: string
		label: string
		min: number
		max: number
		value: number
	}
}

class StepSequencer extends AudioView<StepSequencer.Props, StepSequencer.State> {
	public override state: StepSequencer.State = {
		isActive: false,
		bpm: 120,
		step: 0,
		padLength: 4,
		sweeps: [55, 110, 220, 440, 880, 1760].map(hz => ({
			frequency: hz,
			pan: 0,
			attack: 0.2,
			release: 0.5,
			length: 2,
			pattern: [[false, false], [false, false], [false, false], [false, false]],
		})),
	}

	private timer?: number

	public renderAudio() {
		const { sweeps, step } = this.state

		return <Scene active={this.state.isActive}>
			<Mixer>
				{sweeps.map((sweep, i) => <SweepPad
					key={i}
					{...sweep}
					step={step}
					wave={waveTable}
				/>)}
			</Mixer>
		</Scene>
	}

	public renderView() {
		const { sweeps, isActive } = this.state

		return <div className="StepSequencer">
			<header>
				<div className="title">
					<span>ModemDN</span>
				</div>
				<div className="controls">
					<div className="bpm">
						<span>BPM</span>
						<input type="range" min={60} max={180} value={this.state.bpm} onChange={this.xBind('changeBPM')} />
						<span>{this.state.bpm}</span>
					</div>
					<div className="pad-length">
						<span>Pad steps</span>
						<input type="number" min={1} max={12} value={this.state.padLength} onChange={this.xBind('changePadLength')}/>
					</div>
					<button className="play" onClick={this.xBind('changeIsPlaying')}>{isActive && 'Stop' || 'Play'}</button>
				</div>
			</header>
			<main>
				{sweeps.map((sweep, i) => <SequencerView key={i}
					name={`${sweep.frequency}Hz`}
					sliders={[
						{ id: 'attack', label: 'Att', min: 0, max: 1, value: sweep.attack },
						{ id: 'release', label: 'Rel', min: 0, max: 1, value: sweep.release },
					]}
					pattern={sweep.pattern}
					step={this.state.step}
					isActive={this.state.isActive}
					onSliderChange={(id, value) => this.changeSweepSlider(i, id as any, value)}
					onPadChange={(step, pan) => this.changeSweepPad(i, step, pan)}
				/>)}
			</main>
		</div>
	}

	public changeIsPlaying(): void {
		this.setState({ isActive: !this.state.isActive }, () => {
			if (!this.state.isActive) {
				window.clearInterval(this.timer)
			}
			else {
				this.updateTimer()
			}
		})
	}

	public changePadLength(event: React.ChangeEvent<HTMLInputElement>): void {
		const { sweeps, padLength: oldPadLength } = this.state
		const newSweeps = [...sweeps]
		const newPadLength = parseInt(event.target.value)

		for (const sweep of newSweeps) {
			if (newPadLength > oldPadLength) {
				let delta = newPadLength - oldPadLength

				while (delta) {
					sweep.pattern.push([false, false])
					delta--
				}
			}
			else {
				sweep.pattern.splice(newPadLength, oldPadLength - newPadLength)
			}
		}

		this.setState({
			padLength: newPadLength,
			sweeps: newSweeps,
			step: 0,
		})
	}

	public changeBPM(event: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({ bpm: parseInt(event.currentTarget.value) }, () => this.updateTimer())
	}

	public changeSweepSlider(target: number, id: 'attack' | 'release', value: number): void {
		const sweeps = [...this.state.sweeps]
		const sweep = sweeps[target]!

		id === 'attack' ? sweep.attack = value : sweep.release = value
		this.setState({ sweeps })
	}

	public changeSweepPad(target: number, step: number, pan: -1 | 1): void {
		const sweeps = [...this.state.sweeps]
		const sweep = sweeps[target]!
		const pattern = sweep.pattern
		const channel = pan === -1 ? 0 : 1
		const currentStepState = pattern[step]![channel]

		pattern[step]![channel] = !currentStepState
		this.setState({ sweeps })
	}

	public override componentWillUnmount(): void {
		window.clearInterval(this.timer)
	}

	private updateTimer(): void {
		window.clearInterval(this.timer)

		this.timer = window.setInterval(() => {
			this.setState({ step: this.state.step + 1 })
		}, 60 / this.state.bpm * 1000)
	}
}
namespace StepSequencer {
	export type Props = RouteComponentProps

	export interface State {
		isActive: boolean
		bpm: number
		padLength: number
		step: number
		sweeps: Sweep[]
	}

	export interface Sweep extends Omit<SweepPad.Props, 'step' | 'wave' | 'pattern'> {
		pattern: Array<[boolean, boolean]>
	}
}

export default StepSequencer
