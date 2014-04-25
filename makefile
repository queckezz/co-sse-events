
BIN = ./node_modules/.bin/

test: node_modules
	@$(BIN)mocha \
		--require should \
		--reporter dot \
		--timeout 10000 \
		--harmony \
		--bail

.PHONY: test