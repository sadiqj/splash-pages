# Re-write existing GC aws credentials to work with awc-cli
export AWS_ACCESS_KEY_ID ?= $(GC_AWS_ACCESS_KEY)
export AWS_SECRET_ACCESS_KEY ?= $(GC_AWS_SECRET)

BROWSERIFY_ARG=--transform brfs --transform browserify-shim --entry assets/js/main.js --outfile $(OUTPUT)/js/main.js \
	--noparse=jquery,lodash,angular,angular-cookies,es5-shim,raven,dialog,mute-console,froogaloop,dialog \
	--bare

CSSLINT_ERRORS = --errors=qualified-headings,shorthand,text-indent,display-property-grouping,empty-rules,underscore-property-hack,overqualified-elements,duplicate-background-image

OUTPUT=build

.PHONY: clean build public images fonts redirects scss-build js-main nunjucks eslint test

watch: server watchify
	scripts/watch.js

clean:
	rm -rf $(OUTPUT)

scss:
	./scripts/sassc --stdin --load-path assets/css --style nested \
		--precision 6 --line-numbers --line-comments

autoprefixer:
	autoprefixer --browsers "last 2 versions" --cascade

csslint:
	csslint --quiet $(CSSLINT_ERRORS) $(OUTPUT)/css/main.css
	csslint --quiet $(CSSLINT_ERRORS) $(OUTPUT)/css/greenhouse-forms.css

scss-main:
	cat assets/css/main.scss | make --quiet scss | \
		make --quiet autoprefixer > $(OUTPUT)/css/main.css

scss-greenhouse-forms:
	cat assets/css/greenhouse-forms.scss | make --quiet scss | \
		make --quiet autoprefixer > $(OUTPUT)/css/greenhouse-forms.css

css-out:
	mkdir -p $(OUTPUT)/css

scss-build: css-out scss-main scss-greenhouse-forms

eslint:
	eslint .

public:
	cp -R public/ $(OUTPUT)/

images:
	cp -R assets/images/ $(OUTPUT)/images/

fonts: css-out
	cp assets/fonts/168784/EC358C0D0D27798ED.css $(OUTPUT)/css/fonts.css

redirects:
	scripts/redirects.js --redirects conf/redirects.json --output $(OUTPUT)

htmlhint:
	htmlhint $(OUTPUT)

nunjucks:
	./scripts/nunjucks.js --search-path templates --search-path pages \
		--search-path macros --search-path includes --input pages \
		--output $(OUTPUT) --cwd pages --require-metadata conf/metadata.js

server: build
	scripts/server.js

watchify:
	watchify $(BROWSERIFY_ARG) --debug

test-watch:
	karma start --auto-watch --no-single-run

test: eslint
	karma start

js:
	mkdir -p $(OUTPUT)/js
	browserify $(BROWSERIFY_ARG)

build: clean fonts images public scss-build csslint redirects nunjucks htmlhint js

deploy: build
	./scripts/s3-deploy.js $(OUTPUT)/** --cwd $(OUTPUT) \
		--region eu-west-1 --bucket $(AWS_S3_BUCKET)
