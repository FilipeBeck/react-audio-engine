import React, { useCallback, useMemo, useRef } from 'react'
import { Analyser, ATOM, ScriptProcessor, Track } from '../../../../../src'

export const Waveloscope: React.FC<Waveloscope.Props> = props => {
	const analyzerRef = useRef<ATOM.Analyser>(null)
	const frequencyBinCount = analyzerRef.current?.node?.frequencyBinCount ?? 0
	const timeDomainData = useMemo(() => new Uint8Array(frequencyBinCount), [frequencyBinCount])

	const handleAudioProcess = useCallback(() => {
		const analyzerNode = analyzerRef.current?.node

		if (analyzerNode) {
			analyzerNode.getByteTimeDomainData(timeDomainData)
			props.onAudioProcess(timeDomainData)
		}
	}, [props.onAudioProcess, timeDomainData])

	return <Track>
		<Analyser ref={analyzerRef} />
		<ScriptProcessor onAudioProcess={handleAudioProcess} />
	</Track>
}
export declare namespace Waveloscope {
	export interface Props {
		onAudioProcess(timeDomainData: Uint8Array): void
	}
}

Waveloscope.displayName = 'Waveloscope'