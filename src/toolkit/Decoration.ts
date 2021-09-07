/**
 * Símbolos compartilhados e identificados pelo nome da propriedade.
 */
const keySymbols = new Map<string, symbol>()

/**
 * Recupera o símbolo para a chave especificada ou cria uma nova se não existir.
 * @param key Nome da propriedade.
 */
function getSymbol(key: string): symbol {
	let keySymbol = keySymbols.get(key)

	if (!keySymbol) {
		keySymbols.set(key, keySymbol = Symbol(key))
	}

	return keySymbol
}
/**
 * Recupera o primeiro manipulador pré-mudança existente na árvore de `target`.
 * @param target Protótipo a ser iterado.
 */
function getFirstWillSet(target: any, keySymbol: symbol): Function | undefined {
	let willSet: Function | undefined

	do {
		willSet = target[keySymbol]?.will
		target = target.__proto__
	}
	while (!willSet && target)

	return willSet
}
/**
 * Recupera o primeiro manipulador pós-mudança existente na árvore de `target`.
 * @param target Protótipo a ser iterado.
 */
function getFirstDidSet(target: any, keySymbol: symbol): Function | undefined {
	let didSet: Function | undefined

	do {
		didSet = target.constructor[keySymbol]?.did
		target = target.__proto__
	}
	while (!didSet && target)

	return didSet
}
/**
 * Decora uma propriedade de classe anexando um manipulador que será executado logo antes da mesma ser modificada.
 */
export function willSet(handler: (newValue: any) => void): any {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor | undefined) {
		if (descriptor) {
			throw new Error()
		}

		const keySymbol = getSymbol(propertyKey)
		const superWillSet = getFirstWillSet(target, keySymbol)
		const thisWillSet = function(this: object, newValue: any) { handler.call(this, newValue); superWillSet?.call(this, newValue) }
		const targetDidSet = target.constructor[keySymbol]?.did as Function | undefined

		target.constructor[keySymbol] = { will: thisWillSet, did: targetDidSet }

		Object.defineProperty(target, propertyKey, {
			get() {
				return this[keySymbol]
			},
			set(newValue: any) {
				const oldValue = this[keySymbol]

				thisWillSet.call(this, newValue)
				this[keySymbol] = newValue
				targetDidSet?.call(this, oldValue)
			},
			configurable: true
		})
	}
}
/**
 * Decora uma propriedade de classe anexando um manipulador que será executado logo após a mesma ser modificada.
 */
export function didSet(handler: (oldValue: any) => void): any {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor | undefined) {
		if (descriptor) {
			throw new Error()
		}

		const keySymbol = getSymbol(propertyKey)
		const superDidSet = getFirstDidSet(target, keySymbol)
		const thisDidSet = function(this: object, oldValue: any) { superDidSet?.call(this, oldValue); handler.call(this, oldValue) }
		const targetWillSet = target.constructor[keySymbol]?.will as Function | undefined

		target.constructor[keySymbol] = { will: targetWillSet, did: thisDidSet }

		Object.defineProperty(target, propertyKey, {
			get() {
				return this[keySymbol]
			},
			set(newValue: any) {
				const oldValue = this[keySymbol]

				targetWillSet?.call(this, newValue)
				this[keySymbol] = newValue
				thisDidSet.call(this, oldValue)
			},
			configurable: true
		})
	}
}
