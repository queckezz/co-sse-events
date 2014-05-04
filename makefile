
BIN = ./node_modules/.bin/

test: node_modules
	@$(BIN)mocha \
		--harmony \
		--reporter dot \
		--timeout 10000 \
		--require should \
		--require co-mocha \
		--bail

.PHONY: test