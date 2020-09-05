function deco(...args) {
	console.log('deco1', ...args)
}

function deco2(...args) {
	console.log('deco2', ...args)
}

class Foo {
	@deco @deco2 bar = 123

	@deco2 @deco bar2 = 456

	@deco
	@deco2
	set foo(v) {}
	get foo() {
		return 3
	}

	@deco2
	@deco
	set foo2(v) {}
	get foo2() {
		return 4
	}

	@deco @deco2 method() {
		console.log(this.bar, this.foo)
	}

	@deco2 @deco method2() {
		console.log(this.bar2, this.foo2)
	}
}

new Foo().method()
new Foo().method2()
