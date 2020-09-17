module.exports = {
	'env': {
		'commonjs': true,
		'es2021': true,
		'node': true,
		'jest':true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'eqeqeq': 'error',
		'no-trailing-spaces': 'error',
		'object-curly-spacing': [
			'error', 'never'
		],
		'arrow-spacing': [
			'error', {'before': true, 'after': true}
		]
	}
};
