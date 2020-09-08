function deco(...args) {
	console.log('deco1', ...args)
}

function deco2(...args) {
	console.log('deco2', ...args)
}

function other(...args) {
	console.log('other', ...args)

	let isDecoratorV2 = false

	if ('kind' in args[0]) isDecoratorV2 = true

	if (isDecoratorV2) {
		return {
			key: args[0].key,
			kind: args[0].kind,
			placement: args[0].placement,
			initializer: args[0].initializer, // undefined if there is no assignment in the field definition
			descriptor:
				args[0].kind === 'method'
					? 'writable' in args[0].descriptor
						? {
								// we have a regular method
								value: args[0].descriptor.value,
								writable: args[0].descriptor.writable,
								enumerable: args[0].descriptor.enumerable,
								configurable: args[0].descriptor.configurable,
						  }
						: {
								// otherwise we have an accessor
								get: args[0].descriptor.get,
								set: args[0].descriptor.set,
								enumerable: args[0].descriptor.enumerable,
								configurable: args[0].descriptor.configurable,
						  }
					: {},
		}
	}

	let calledAsPropertyDecorator = false
	const prototype = args[0]
	const name = args[1]
	let descriptor = args[2]

	if (!descriptor) {
		calledAsPropertyDecorator = true
		descriptor = Object.getOwnPropertyDescriptor(prototype, name)
	}

	// If a decorator is called on a property, then returning a descriptor does
	// nothing, so we need to set the descriptor manually.
	if (calledAsPropertyDecorator) {
		// Don't set a descriptor if we don't intend to change anything.
		/*Object.defineProperty(prototype, name, descriptor)*/
	}
	// If a decorator is called on an accessor or method, then we must return a
	// descriptor (whether we intend to modify it or not) otherwise chaining
	// decorators fails. Also trying to set the descriptor on the prototype instead
	// of returning it won't work; it'll be over-written.
	else return descriptor
	// Weird, huh?
}

class Foo {
	@deco @other @deco2 bar = 123

	@deco2 @other @deco bar2 = 456

	@deco
	@other
	@deco2
	set foo(v) {}
	get foo() {
		return 3
	}

	@deco2
	@other
	@deco
	set foo2(v) {}
	get foo2() {
		return 4
	}

	@deco @other @deco2 method() {
		console.log(this.bar, this.foo)
	}

	@deco2 @other @deco method2() {
		console.log(this.bar2, this.foo2)
	}
}

new Foo().method()
new Foo().method2()
