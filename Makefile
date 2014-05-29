# Re-write existing GC aws credentials to work with awc-cli
export AWS_ACCESS_KEY_ID ?= $(GC_AWS_ACCESS_KEY)
export AWS_SECRET_ACCESS_KEY ?= $(GC_AWS_SECRET)

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

scss:
	./scripts/sassc --stdin --load-path app/css --style nested \
		--precision 6 --line-numbers --line-comments

autoprefixer:
	autoprefixer --browsers "last 2 versions" --cascade

csslint:
	csslint --quiet $(CSSLINT_ERRORS) $(OUTPUT)/css/main.css
	csslint --quiet $(CSSLINT_ERRORS) $(OUTPUT)/css/greenhouse-forms.css

scss-main:
	cat app/css/main.scss | make --quiet scss | \
		make --quiet autoprefixer > $(OUTPUT)/css/main.css

scss-greenhouse-forms:
	cat app/css/greenhouse-forms.scss | make --quiet scss | \
		make --quiet autoprefixer > $(OUTPUT)/css/greenhouse-forms.css

css-out:
	mkdir -p $(OUTPUT)/css

css: css-out scss-main scss-greenhouse-forms

eslint:
	eslint .

public:
	cp -R app/public/ $(OUTPUT)/

images:
	cp -R app/images/ $(OUTPUT)/images/

fonts: css-out
	cp app/fonts/168784/EC358C0D0D27798ED.css $(OUTPUT)/css/fonts.css

redirects:
	scripts/redirects.js --redirects conf/redirects.json --output $(OUTPUT)

htmlhint:
	htmlhint $(OUTPUT)

nunjucks:
	./scripts/nunjucks.js --search-path app/templates --search-path app/pages \
		--search-path app/macros --search-path app/includes --input app/pages \
		--output $(OUTPUT) --cwd app/pages --require-metadata conf/metadata.js

server: build
	scripts/server.js

test-watch:
	karma start --auto-watch --no-single-run

test: eslint
	karma start

js-out:
	mkdir -p $(OUTPUT)/js

js-main: js-out
	browserify $(BROWSERIFY_ARG)
	uglifyjs build/js/main.js --output build/js/main.js \
		--source-map build/js/main.map.js \
		--source-map-include-sources=true \
		--source-map-root='build/' \
		--source-map-url='/js/main.map.js'

js-vendor: js-out
	cat app/components/jquery/dist/jquery.js app/components/es5-shim/es5-shim.js \
		app/components/mute-console/mute-console.js \
		app/js/vendor.js > build/js/vendor.js
	uglifyjs build/js/vendor.js --output build/js/vendor.js \
		--source-map build/js/vendor.map.js \
		--source-map-include-sources=true \
		--source-map-root='build/' \
		--source-map-url='/js/vendor.map.js'

js: js-main js-vendor

build: clean fonts images public css csslint redirects nunjucks htmlhint js

deploy: build
	scripts/s3-deploy.js $(OUTPUT)/** --cwd $(OUTPUT) \
		--region eu-west-1 --bucket $(AWS_S3_BUCKET)
