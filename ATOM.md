# Audio Tree Object Model

Modelo de objetos da árvore de áudio

## [_Container_](./Container.ts)

Representa um simples agregado recursivo, com operações de adição e remoção de elementos filhos.

## [Stage](./Stage.ts)

Representa um container para os cenários. O mais comum é ter apenas um cenário, mas a possibilidade de ter mais de um é útil para implementar previews de efeitos e configurações de forma otimizada.

## [_Module_](./Module.ts)

Classe base para os demais componentes de áudio. Um módulo de áudio é análogo à uma rede neural (com instâncias de `AudioNode` no lugar de neurônios) do ponto de vista de sua estrutura e a forma como as conexões são feitas com outros módulos. Ele possui um conjunto de instâncias de `AudioNode` como entrada, um conjunto de instâncias de `AudioNode` como saída e um conjunto de instâncias de `AudioNode` intermediários. As conexões são feitas recuperando todas as saídas de um módulo e conectando cada uma delas com todas as entradas de um módulo frontal. Caso um módulo não contenha entradas, será recuperada as entradas do módulo mais próximo de forma recursiva, e a forma como as entradas são recuperadas depende do módulo pai. O mesmo ocorre para um módulo que não contiver saídas, sendo recuperada as saídas do módulo mais próximo de forma recursiva. A única classe que define instâncias de `AudioNode` próprias como entradas e saídas é `Element`, possuindo um único `AudioNode` que serve tanto como entrada quanto saída. As demais classes apenas manipulam as entradas, saídas e conexões.

## [_Flow_](./Flow.ts)

Representa um fluxo de nós conectados em série.

## [Mixer](./Mixer.ts)

Módulo que conecta cada filho direto de forma paralela com o módulo anterior e combina as suas saídas paralelamente.

## [Track](./Track.ts)

Módulo que conecta cada módulo filho em série e tem como entradas e saídas o primeiro e último módulo, respectivamente.

## [_Branch_](./Branch.ts)

Representa um fluxo cujo destino é ramificado, terminando em `BaseAudioContext.destination` se não fornecido explicitamente.

## [Bypass](./Bypass.ts)

Módulo que ramifica o sinal recebido, terminando em `AudioContext.destination` se não fornecido explicitamente.

## [Merger](./Merger.ts)

Módulo que conecta seu antecessor com uma lista de módulos nomeados.

## [_Jack_](./Jack.ts)

Representa um módulo que contém um nó para um elemento de áudio nativo, podendo ser um descendente de `BaseAudioContext` ou `AudioNode`.

## [_Scenario_](./Scenario.ts)

Representa um grapho de áudio, online ou offline. É responsável por criar as instâncias de `BaseAudioContext`. Todo módulo precisa ser filho direto ou indireto de `Scenario`.

## [Scene](./Scene.ts)

Módulo que representa um cenário online (que usa `AudioContext`) com contexto de áudio único que será instanciado e propagado para os módulos filhos.

## [Record](./Record.ts)

Módulo que representa um cenário offline (que usa `OfflineAudioContext`) com contexto de áudio único que será instanciado e propagado para os módulos filhos.

## [elements/](./elements)

Contém as classes que representam os nós de áudio nativos:

- [_Element_](./elements/Element.ts) - Classe base para as demais.
- [Analyser](./elements/Analyser.ts) - Representa um [AnalyserNode](https://developer.mozilla.org/docs/Web/API/AnalyserNode)
- [BiquadFilter](./elements/BiquadFilter.ts) - Representa um [BiquadFilterNode](https://developer.mozilla.org/docs/Web/API/BiquadFilterNode)
- [BufferSource](./elements/BufferSource.ts) - Representa um [AudioBufferSourceNode](https://developer.mozilla.org/docs/Web/API/AudioBufferSourceNode)
- [ConstantSource](./elements/ConstantSource.ts) - Representa um [ConstantSourceNode](https://developer.mozilla.org/docs/Web/API/ConstantSourceNode)
- [Convolver](./elements/Convolver.ts) - Representa um [ConvolverNode](https://developer.mozilla.org/docs/Web/API/ConvolverNode)
- [Delay](./elements/Delay.ts) - Representa um [DelayNode](https://developer.mozilla.org/docs/Web/API/DelayNode)
- [DynamicsCompressor](./elements/DynamicsCompressor.ts) - Representa um [DynamicsCompressorNode](https://developer.mozilla.org/docs/Web/API/DynamicsCompressorNode)
- [Gain](./elements/Gain.ts) - Representa um [GainNode](https://developer.mozilla.org/docs/Web/API/GainNode)
- [IIRFilter](./elements/IIRFilter.ts) - Representa um [IIRFilterNode](https://developer.mozilla.org/docs/Web/API/IIRFilterNode)
- [MediaElementSource](./elements/MediaElementSource.ts) - Representa um [MediaElementAudioSourceNode](https://developer.mozilla.org/docs/Web/API/MediaElementAudioSourceNode)
- [MediaStreamDestination](./elements/MediaStreamDestination.ts) - Representa um [MediaStreamAudioDestinationNode](https://developer.mozilla.org/docs/Web/API/MediaStreamAudioDestinationNode)
- [MediaStreamSource](./elements/MediaStreamSource.ts) - Representa um [MediaStreamAudioSourceNode](https://developer.mozilla.org/docs/Web/API/MediaStreamAudioSourceNode)
- [Oscillator](./elements/Oscillator.ts) - Representa um [OscillatorNode](https://developer.mozilla.org/docs/Web/API/OscillatorNode)
- [Panner](./elements/Panner.ts) - Representa um [PannerNode](https://developer.mozilla.org/docs/Web/API/PannerNode)
- [ScheduledSource](./elements/ScheduledSource.ts) - Representa um [AudioScheduledSourceNode](https://developer.mozilla.org/docs/Web/API/AudioScheduledSourceNode)
- [ScriptProcessor](./elements/ScriptProcessor.ts) - Representa um [ScriptProcessorNode](https://developer.mozilla.org/docs/Web/API/ScriptProcessorNode)
- [StereoPanner](./elements/StereoPanner.ts) - Representa um [StereoPannerNode](https://developer.mozilla.org/docs/Web/API/StereoPannerNode)
- [WaveShaper](./elements/WaveShaper.ts) - Representa um [WaveShaperNode](https://developer.mozilla.org/docs/Web/API/WaveShaperNode)
- [Worklet](./elements/Worklet.ts) - Representa um [AudioWorkletNode](https://developer.mozilla.org/docs/Web/API/AudioWorkletNode)
