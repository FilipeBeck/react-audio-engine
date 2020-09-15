import React, { useState, useCallback, useEffect } from 'react'
import { ATOM, Gain, Mixer, Oscillator, Parameterization, StereoPanner, Track } from '../../../../../src'

export const SweepPad: React.FC<SweepPad.Props> = props => {
	const { attack, frequency, length, pattern, release, step, wave } = props
	const [firstExecutions, setFirstExecutions] = useState(Array<boolean>())
	const patternOffset = step % pattern.length

	const attackParameterization: Parameterization.Functional = useCallback(context => {
		const currentTime = context.currentTime

		return [
			0,
			attack >= 0.1 && { type: 'linear', value: 1, endTime: currentTime + attack } || 1,
			{ type: 'linear', value: 0, endTime: currentTime + length + release },
		]
	}, [step])


	useEffect(() => {
		const newFirstExecutions = Array<boolean>()

		for (let i = 0, count = pattern.length; i < count; i++) {
			newFirstExecutions.push(false)
		}

		setFirstExecutions(newFirstExecutions)
	}, [pattern.length])

	return <Track>
		<Mixer>
			{pattern.map((flag, i) => <Track key={i}>
				<Oscillator
					start={true}
					frequency={frequency}
					periodicWave={wave}
				/>
				<Gain level={(firstExecutions[i] === undefined || firstExecutions[i] === true) ? 0 : (
					(flag[0] || flag[1]) && patternOffset == i && attackParameterization || Parameterization.KEEP
				)} />
				<StereoPanner pan={(flag[0] && -1 || 0) + (flag[1] && 1 || 0)}/>
			</Track>)}
		</Mixer>
	</Track>
}
export declare namespace SweepPad {
	export interface Props {
		frequency: number
		attack: number
		release: number
		length: number
		pattern: Array<[boolean, boolean]>
		step: number
		wave: ATOM.Oscillator.PeriodicWave
	}
}

SweepPad.displayName = 'SweepPad'