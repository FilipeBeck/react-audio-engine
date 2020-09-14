import Element from './Element'
/**
 * Representa um {@link https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode `ScriptProcessorNode`}.
 */
class ScriptProcessor extends Element<ScriptProcessorNode, ScriptProcessor.Attributes> {
	/**
	 * Constrói e retorna um novo nó.
	 */
	protected constructNode(): ScriptProcessorNode {
		return this.context!.createScriptProcessor()
	}
	/**
	 * Aplica o atributo com o nome e valor especificados.
	 * @param name Nome do atributo.
	 * @param value Valor do atributo.
	 */
	protected applyAttribute<$Name extends keyof ScriptProcessor.Attributes>(name: $Name, value: ScriptProcessor.Attributes[$Name]): void {
		switch (name) {
			case 'onAudioProcess':
				this.updateEventListener('audioprocess', value, this.attributes.onAudioProcess)
			break

			default: super.applyAttribute(name, value)
		}
	}
}
namespace ScriptProcessor {
	/**
	 * Atributos de `ScriptProcessor`.
	 */
	export interface Attributes extends Element.Attributes.Audio {
		/**
		 * Tamanho do buffer de entrada/saída. Precisa ser potência de 2 e estar entre `256` e `16384`.
		 * @default 2048
		 */
		bufferSize?: number
		/**
		 * Invocado quando o buffer de entrada estiver pronto para ser processado.
		 * @param this Nó on ocorreu o evento.
		 * @param event Evento associado.
		 */
		onAudioProcess?(this: ScriptProcessorNode, event: AudioProcessingEvent): void
	}
}

export default ScriptProcessor