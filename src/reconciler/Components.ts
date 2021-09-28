import React from 'react'
import Tag from './Tag'
import * as ATOM from '../atom'
/**
 * Callback que usa contexto de áudio.
 */
export import ContextFC = ATOM.Jack.ContextFC
/**
 * Parametrização. Quando for um array, a ordem de aplicação se dá do primeiro ao último elemento. Sempre que uma parametrização for aplicada, a mesma cancelará qualquer aplicação anterior (mesmo que o novo valor seja uma array vazio), a não ser quando o novo valor for Parameterization.KEEP.
 */
export import Parameterization = ATOM.Jack.Parameterization
/**
 * Representa um `ATOM.Mixer`.
 */
export const Mixer: React.FC<Mixer.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.MIXER, { ...props, ref }, props.children)
})
export namespace Mixer {
	/**
	 * Atributos de `Mixer`.
	 */
	export interface Props extends ATOM.Mixer.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Mixer>
	}
}
Mixer.displayName = 'Mixer'
/**
 * Representa um `ATOM.Track`.
 */
export const Track: React.FC<Track.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.TRACK, { ...props, ref }, props.children)
})
export namespace Track {
	/**
	 * Atributos de `Track`.
	 */
	export interface Props extends ATOM.Track.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Track>
	}
}
Track.displayName = 'Track'
/**
 * Representa um `ATOM.Bypass`.
 */
export const Bypass: React.FC<Bypass.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.BYPASS, { ...props, ref }, props.children)
})
export namespace Bypass {
	/**
	 * Atributos de `Bypass`.
	 */
	export interface Props extends ATOM.Bypass.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Bypass>
	}
}
Bypass.displayName = 'Bypass'
/**
 * Representa um `ATOM.Merger`.
 */
export const Merger: React.FC<Merger.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.MERGER, { ...props, ref }, props.children)
})
export namespace Merger {
	/**
	 * Atributos de `Merger`.
	 */
	export interface Props extends ATOM.Merger.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Merger>
	}
}
Merger.displayName = 'Merger'
/**
 * Representa um `ATOM.Scene`.
 */
export const Scene: Scene = React.forwardRef((props, ref) => {
	return React.createElement(Tag.SCENE, { ...props, ref }, props.children)
}) as any
export interface Scene extends React.FC<Scene.Props> {
	/**
	 * Representa uma categoria de latência.
	 */
	LatencyCategory: typeof ATOM.Scene.LatencyCategory;
}
export namespace Scene {
	/**
	 * Atributos de `Scene`.
	 */
	export interface Props extends ATOM.Scene.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Scene>
	}
}
Scene.displayName = 'Scene'
/**
 * Representa um `ATOM.Record`.
 */
export const Record: React.FC<Record.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.RECORD, { ...props, ref }, props.children)
})
export namespace Record {
	/**
	 * Atributos de `Record`.
	 */
	export interface Props extends ATOM.Record.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Record>
	}
}
Record.displayName = 'Record'
/**
 * Representa um `ATOM.Analyser`.
 */
export const Analyser: React.FC<Analyser.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.ANALYSER, { ...props, ref }, props.children)
})
export namespace Analyser {
	/**
	 * Atributos de `Analyser`.
	 */
	export interface Props extends ATOM.Analyser.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Analyser>
	}
}
Analyser.displayName = 'Analyser'
/**
 * Representa um `ATOM.BufferSource`.
 */
export const BufferSource: React.FC<BufferSource.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.BUFFER_SOURCE, { ...props, ref }, props.children)
})
export namespace BufferSource {
	/**
	 * Atributos de `BufferSource`.
	 */
	export interface Props extends ATOM.BufferSource.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.BufferSource>
	}
}
BufferSource.displayName = 'BufferSource'
/**
 * Representa um `ATOM.BiquadFilter`.
 */
export const BiquadFilter: BiquadFilter = React.forwardRef((props, ref) => {
	return React.createElement(Tag.BIQUAD_FILTER, { ...props, ref }, props.children)
}) as any
export interface BiquadFilter extends React.FC<BiquadFilter.Props> {
	/**
	 * Define o tipo de algoritmo de filtragem que `BiquadFilter` está implementando, afetando o significado de seus atributos (exceto detune, que tem o mesmo significado para todos).
	 */
	Type: typeof ATOM.BiquadFilter.Type;
}
export namespace BiquadFilter {
	/**
	 * Atributos de `BiquadFilter`.
	 */
	export interface Props extends ATOM.BiquadFilter.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.BiquadFilter>
	}
}
BiquadFilter.displayName = 'BiquadFilter'
/**
 * Representa um `ATOM.ConstantSource`.
 */
export const ConstantSource: React.FC<ConstantSource.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.CONSTANT_SOURCE, { ...props, ref }, props.children)
})
export namespace ConstantSource {
	/**
	 * Atributos de `ConstantSource`.
	 */
	export interface Props extends ATOM.ConstantSource.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.ConstantSource>
	}
	export type Scheduling = ATOM.ScheduledSource.Scheduling
}
ConstantSource.displayName = 'ConstantSource'
/**
 * Representa um `ATOM.Convolver`.
 */
export const Convolver: React.FC<Convolver.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.CONVOLVER, { ...props, ref }, props.children)
})
export namespace Convolver {
	/**
	 * Atributos de `Convolver`.
	 */
	export interface Props extends ATOM.Convolver.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Convolver>
	}
}
Convolver.displayName = 'Convolver'
/**
 * Representa um `ATOM.Delay`.
 */
export const Delay: React.FC<Delay.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.DELAY, { ...props, ref }, props.children)
})
export namespace Delay {
	/**
	 * Atributos de `Delay`.
	 */
	export interface Props extends ATOM.Delay.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Delay>
	}
}
Delay.displayName = 'Delay'
/**
 * Representa um `ATOM.DynamicsCompressor`.
 */
export const DynamicsCompressor: React.FC<DynamicsCompressor.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.DYNAMICS_COMPRESSOR, { ...props, ref }, props.children)
})
export namespace DynamicsCompressor {
	/**
	 * Atributos de `DynamicsCompressor`.
	 */
	export interface Props extends ATOM.DynamicsCompressor.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.DynamicsCompressor>
	}
}
DynamicsCompressor.displayName = 'DynamicsCompressor'
/**
 * Representa um `ATOM.Gain`.
 */
export const Gain: React.FC<Gain.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.GAIN, { ...props, ref }, props.children)
})
export namespace Gain {
	/**
	 * Atributos de `Gain`.
	 */
	export interface Props extends ATOM.Gain.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Gain>
	}
}
Gain.displayName = 'Gain'
/**
 * Representa um `ATOM.IIRFilter`.
 */
export const IIRFilter: React.FC<IIRFilter.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.IIR_FILTER, { ...props, ref }, props.children)
})
export namespace IIRFilter {
	/**
	 * Atributos de `IIRFilter`.
	 */
	export interface Props extends ATOM.IIRFilter.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.IIRFilter>
	}
}
IIRFilter.displayName = 'IIRFilter'
/**
 * Representa um `ATOM.MediaElementSource`.
 */
export const MediaElementSource: React.FC<MediaElementSource.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.MEDIA_ELEMENT_SOURCE, { ...props, ref }, props.children)
})
export namespace MediaElementSource {
	/**
	 * Atributos de `MediaElementSource`.
	 */
	export interface Props extends ATOM.MediaElementSource.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.MediaElementSource>
	}
}
MediaElementSource.displayName = 'MediaElementSource'
/**
 * Representa um `ATOM.MediaStreamDestination`.
 */
export const MediaStreamDestination: React.FC<MediaStreamDestination.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.MEDIA_STREAM_DESTINATION, { ...props, ref }, props.children)
})
export namespace MediaStreamDestination {
	/**
	 * Atributos de `MediaStreamDestination`.
	 */
	export interface Props extends ATOM.MediaStreamDestination.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.MediaStreamDestination>
	}
}
MediaStreamDestination.displayName = 'MediaStreamDestination'
/**
 * Representa um `ATOM.MediaStreamSource`.
 */
export const MediaStreamSource: React.FC<MediaStreamSource.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.MEDIA_STREAM_SOURCE, { ...props, ref }, props.children)
})
export namespace MediaStreamSource {
	/**
	 * Atributos de `MediaStreamSource`.
	 */
	export interface Props extends ATOM.MediaStreamSource.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.MediaStreamSource>
	}
}
MediaStreamSource.displayName = 'MediaStreamSource'
/**
 * Representa um `ATOM.Oscillator`.
 */
export const Oscillator: Oscillator = React.forwardRef((props, ref) => {
	return React.createElement(Tag.OSCILLATOR, { ...props, ref }, props.children)
}) as any
export interface Oscillator extends React.FC<Oscillator.Props> {
	/**
	 * Tipo de onda.
	 */
	Type: typeof ATOM.Oscillator.Type;
}
export namespace Oscillator {
	/**
	 * Atributos de `Oscillator`.
	 */
	export interface Props extends ATOM.Oscillator.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Oscillator>;
	}
	/**
	 * Propriedades de uma onda periódica.
	 */
	export type PeriodicWave = ATOM.Oscillator.PeriodicWave;
}
Oscillator.displayName = 'Oscillator'
/**
 * Representa um `ATOM.Panner`.
 */
export const Panner: Panner = React.forwardRef((props, ref) => {
	return React.createElement(Tag.PANNER, { ...props, ref }, props.children)
}) as any
export interface Panner extends React.FC<Panner.Props> {
	/**
	 * Algoritmo usado na redução de volume de acordo com a distância de `listener`.
	 */
	DistanceModel: typeof ATOM.Panner.DistanceModel
	/**
	 * Algoritmo de espacialização usado para posicionar o áudio no espaço 3D.
	 */
	PanningModel: typeof ATOM.Panner.PanningModel
}
export namespace Panner {
	/**
	 * Atributos de `Panner`.
	 */
	export interface Props extends ATOM.Panner.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.Panner>
	}
}
Panner.displayName = 'Panner'
/**
 * Representa um `ATOM.WaveShaper`.
 */
export const WaveShaper: WaveShaper = React.forwardRef((props, ref) => {
	return React.createElement(Tag.WAVE_SHAPER, { ...props, ref }, props.children)
}) as any
export interface WaveShaper extends React.FC<WaveShaper.Props> {
	/**
	 * Técnica de {@link https://en.wikipedia.org/wiki/Oversampling oversampling} aplicada à curva. Oversampling é uma técnica onde se cria mais amostras antes de aplicar o efeito de distorção ao sinal. Uma vez aplicada, o número de amostras é reduzido ao valor inicial. Isso leva a resultados melhores devido à redução de {@link https://en.wikipedia.org/wiki/Aliasing cerrilhamento}, mas às custas de uma curva de modelagem com precisão mais baixa.
	 */
	Oversample: ATOM.WaveShaper.Oversample
}
export namespace WaveShaper {
	/**
	 * Atributos de `WaveShaper`.
	 */
	export interface Props extends ATOM.WaveShaper.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.WaveShaper>
	}
}
WaveShaper.displayName = 'WaveShaper'
/**
 * Representa um `ATOM.StereoPanner`.
 */
export const StereoPanner: React.FC<StereoPanner.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.STEREO_PANNER, { ...props, ref }, props.children)
})
export namespace StereoPanner {
	/**
	 * Atributos de `StereoPanner`.
	 */
	export interface Props extends ATOM.StereoPanner.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.StereoPanner>
	}
}
StereoPanner.displayName = 'StereoPanner'
/**
 * Representa um `ATOM.Worklet`.
 */
export const Worklet: React.FC<Worklet.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.WORKLET, { ...props, ref }, props.children)
})
export namespace Worklet {
	/**
	 * Atributos de `Worklet`.
	 */
	export interface Props extends ATOM.Worklet.Attributes {
		/**
		 * ReferÊncia ao elemento host.
		 */
		ref?: React.Ref<ATOM.Worklet>
	}
}
Worklet.displayName = 'Worklet'
/**
 * Representa um `ATOM.ScriptProcessor`.
 */
export const ScriptProcessor: React.FC<ScriptProcessor.Props> = React.forwardRef((props, ref) => {
	return React.createElement(Tag.SCRIPT_PROCESSOR, { ...props, ref }, props.children)
})
export namespace ScriptProcessor {
	/**
	 * Atributos de `ScriptProcessor`.
	 */
	export interface Props extends ATOM.ScriptProcessor.Attributes {
		/**
		 * Referência ao elemento host.
		 */
		ref?: React.Ref<ATOM.ScriptProcessor>
	}
}
ScriptProcessor.displayName = 'ScriptProcessor'
