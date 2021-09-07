import ReactReconciler from 'react-reconciler'
import Delegate from './Delegate'
import * as ATOM from '../atom'
/**
 * Renderizador.
 */
namespace Renderer {
	/**
	 * Reconciliador.
	 */
	const reconciler = ReactReconciler(Delegate)
	/**
	 * Mapa de containers com componentes react.
	 */
	const containers = new Map<ATOM.Stage, ReactReconciler.FiberRoot>()
	/**
	 * Rendereiza o elemento especificado.
	 * @param reactElement Elemento a ser renderizado.
	 * @param stage Container da renderização.
	 * @param completionHandler Manipulador de finalização.
	 */
	export function render(reactElement: React.ReactElement, stage: ATOM.Stage, completionHandler?: any): number {
		let container = containers.get(stage)

		if (!container) {
			containers.set(stage, container = reconciler.createContainer(stage, true, false))
		}

		return reconciler.updateContainer(reactElement, container, null, completionHandler)
	}
	/**
	 * Ativa a inspeção dos componentes através da extensão do React.
	 * FIXME: Os nomes dos omponentes não estão sendo exibidos.
	 */
	reconciler.injectIntoDevTools({
		bundleType: 0,
		version: '0.0.3',
		rendererPackageName: 'react-audio-engine',
	})
}

export default Renderer
