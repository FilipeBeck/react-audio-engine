/**
 * Nomes das tags.
 */
const enum Tag {
	/**
	 * Módulo que conecta cada filho de forma paralela com o módulo anterior e combina as suas saídas paralelamente.
	 */
	MIXER = 'mixer',
	/**
	 * Módulo que conecta cada filho em série e tem como entradas e saídas o primeiro e último módulo, respectivamente.
	 */
	TRACK = 'track',
	/**
	 * Módulo que ramifica o sinal recebido, terminando em `AudioContext.destination` se não fornecido explicitamente.
	 */
	BYPASS = 'bypass',
	/**
	 * Módulo que conecta seu antecessor com uma lista de módulos nomeados.
	 */
	MERGER = 'merger',
	/**
	 * Módulo que representa uma cena com contexto de áudio único que será instanciado e propagado para os módulos filhos.
	 */
	SCENE = 'scene',
	/**
	 * Módulo que representa uma cena com contexto de áudio offline.
	 */
	RECORD = 'record',
	/**
	 * Representa um container para as cenas. O mais comum é ter apenas uma cena, mas a possibilidade de ter mais de uma é útil para implementar previews de efeitos e configurações.
	 */
	STAGE = 'stage',
	/**
	 * Elemento capaz de fornecer informações em tempo real sobre análise de frequência e domínio de tempo.
	 */
	ANALYSER = 'analyzer',
	/**
	 * Elemento consistindo de uma fonte de áudio em memória.
	 */
	BUFFER_SOURCE = 'buffer-source',
	/**
	 * Elemento que representa um filtro simples de baixa ordem.
	 */
	BIQUAD_FILTER = 'biquad-filter',
	/**
	 * Elemento que reúne diferentes entradas mono em uma única saída.
	 */
	CHANNEL_MERGER = 'channel-merger',
	/**
	 * Elemento que separa os diferentes canais de áudio em um conjunto de saídas mono.
	 */
	CHANNEL_SPLITTER = 'channel-splitter',
	/**
	 * Elemento cuja fonte de áudio é um valor constante.
	 */
	CONSTANT_SOURCE = 'constant-source',
	/**
	 * Elemento que executa uma convolução linear no áudio.
	 */
	CONVOLVER = 'convolver',
	/**
	 * Elemento que representa um {@link https://en.wikipedia.org/wiki/Digital_delay_line delay-line}.
	 */
	DELAY = 'delay',
	/**
	 * Elemento que fornece um efeito de compressão.
	 */
	DYNAMICS_COMPRESSOR = 'dynamics-compressor',
	/**
	 * Elemento que controla o volume.
	 */
	GAIN = 'gain',
	/**
	 * Elemento que implementa um {@link https://en.wikipedia.org/wiki/infinite%20impulse%20response infinite impulse response}.
	 */
	IIR_FILTER = 'iir-filter',
	/**
	 * Elemento que representa um `<audio/>` ou `<video/>`.
	 */
	MEDIA_ELEMENT_SOURCE = 'media-element-source',
	/**
	 * Elemento que representa um destino de áudio de um {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream `MediaStream`} {@link https://developer.mozilla.org/en-US/docs/WebRTC WebRTC}.
	 */
	MEDIA_STREAM_DESTINATION = 'media-stream-destination',
	/**
	 * Elemento cuja fonte de áudio é um {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream `MediaStream`}.
	 */
	MEDIA_STREAM_SOURCE = 'media-stream-source',
	/**
	 * Elemento que representa uma onda periódica.
	 */
	OSCILLATOR = 'oscillator',
	/**
	 * Elemento que representa a posição e comportamento do aúdio no espaço.
	 */
	PANNER = 'panner',
	/**
	 * Elemento que representa uma distorção não-linear.
	 */
	WAVE_SHAPER = 'wave-shaper',
	/**
	 * Elemento que representa um simples panner stereo.
	 */
	STEREO_PANNER = 'stereo-panner',
	/**
	 * Elemento de áudio customizado.
	 */
	WORKLET = 'worklet',
	/**
	 * Elemento que representa um `ScriptProcessorNode`.
	 */
	SCRIPT_PROCESSOR = 'script-processor',
}

export default Tag
