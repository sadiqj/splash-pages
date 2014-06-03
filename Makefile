# Re-write existing GC aws credentials to work with awc-cli
export AWS_ACCESS_KEY_ID ?= $(GC_AWS_ACCESS_KEY)
export AWS_SECRET_ACCESS_KEY ?= $(GC_AWS_SECRET)

BIN=node_modules/.bin

BROWSERIFY_ARG= --transform brfs --transform browserify-shim --entry app/js/main.js \
	--noparse=lodash --noparse=dialog \
	--detect-globals=false --insert-globals=false --insert-global-vars='' > build/js/main.js

CSSLINT_ERRORS = --errors=qualified-headings,shorthand,text-indent,display-property-grouping,empty-rules,underscore-property-hack,overqualified-elements,duplicate-background-image

OUTPUT=build

.PHONY: clean build public images fonts redirects scss-build js-main nunjucks eslint test

watch:
	scripts/watch.js & make server

clean:
	rm -rf $(OUTPUT)

csslint:
	$(BIN)/csslint $(CSSLINT_ERRORS) $(OUTPUT)/css/main.css
	$(BIN)/csslint $(CSSLINT_ERRORS) $(OUTPUT)/css/greenhouse-forms.css

scss-main:
	$(BIN)/node-sass --include-path app/css --output-style nested --source-comments=normal \
		app/css/main.scss --output $(OUTPUT)/css/main.css
	$(BIN)/autoprefixer --browsers "last 2 versions" --cascade $(OUTPUT)/css/main.css --output $(OUTPUT)/css/main.css

scss-greenhouse-forms:
	$(BIN)/node-sass --include-path app/css --output-style nested --source-comments=normal \
		app/css/greenhouse-forms.scss --output $(OUTPUT)/css/greenhouse-forms.css
	$(BIN)/autoprefixer --browsers "last 2 versions" --cascade $(OUTPUT)/css/greenhouse-forms.css --output $(OUTPUT)/css/greenhouse-forms.css

css-out:
	mkdir -p $(OUTPUT)/css

css: css-out scss-main scss-greenhouse-forms

eslint:
	$(BIN)/eslint .

public:
	cp -R app/public/ $(OUTPUT)/

images:
	cp -R app/images/ $(OUTPUT)/images/

fonts: css-out
	cp app/fonts/168784/EC358C0D0D27798ED.css $(OUTPUT)/css/fonts.css

redirects:
	scripts/redirects.js --redirects conf/redirects.json --output $(OUTPUT)

htmlhint:
	$(BIN)/htmlhint $(OUTPUT)

nunjucks:
	./scripts/nunjucks.js --search-path app/templates --search-path app/pages \
		--search-path app/macros --search-path app/includes --input app/pages \
		--output $(OUTPUT) --cwd app/pages --require-metadata conf/metadata.js

server: build
	scripts/server.js

test-watch:
	$(BIN)/karma start --auto-watch --no-single-run

test: eslint
	$(BIN)/karma start

js-out:
	mkdir -p $(OUTPUT)/js

js-main: js-out
	$(BIN)/browserify $(BROWSERIFY_ARG)
	$(BIN)/uglifyjs build/js/main.js --output build/js/main.js \
		--source-map build/js/main.map.js \
		--source-map-include-sources=true \
		--source-map-root='build/' \
		--source-map-url='/js/main.map.js'

js-vendor: js-out
	cat app/components/jquery/dist/jquery.js app/components/es5-shim/es5-shim.js \
		app/components/mute-console/mute-console.js \
		app/js/vendor.js app/components/dialog.js/dialog.js > build/js/vendor.js
	$(BIN)/uglifyjs build/js/vendor.js --output build/js/vendor.js \
		--source-map build/js/vendor.map.js \
		--source-map-include-sources=true \
		--source-map-root='build/' \
		--source-map-url='/js/vendor.map.js'

js: js-main js-vendor

csso:
	$(BIN)/csso build/css/fonts.css build/css/fonts.css
	$(BIN)/csso build/css/main.css build/css/main.css
	$(BIN)/csso build/css/greenhouse-forms.css build/css/greenhouse-forms.css

build: clean fonts images public css csslint redirects nunjucks htmlhint js

deploy: build csso
	scripts/s3-deploy.js $(OUTPUT)/** --cwd $(OUTPUT) \
		--region eu-west-1 --bucket $(AWS_S3_BUCKET)
