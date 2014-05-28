clean:
	rm -rf build

scss:
	./scripts/sassc --stdin --load-path assets/css --style nested \
		--precision 6 --line-numbers --line-comments

autoprefixer:
	autoprefixer --browsers "last 2 versions" --cascade

csslint:
	csslint --quiet --errors=qualified-headings,shorthand,text-indent,display-property-grouping,empty-rules,underscore-property-hack,overqualified-elements,duplicate-background-image build/css/main.css
	csslint --quiet --errors=qualified-headings,shorthand,text-indent,display-property-grouping,empty-rules,underscore-property-hack,overqualified-elements,duplicate-background-image build/css/greenhouse-forms.css

scss-main:
	cat assets/css/main.scss | make --quiet scss | make --quiet autoprefixer > build/css/main.css

scss-greenhouse-forms:
	cat assets/css/greenhouse-forms.scss | make --quiet scss | make --quiet autoprefixer > build/css/greenhouse-forms.css

css-out:
	mkdir -p build/css

scss-build: css-out scss-main scss-greenhouse-forms

eslint:
	eslint .

public:
	cp -R public build

images:
	cp -R assets/images build

fonts:
	cp -R assets/fonts build

redirects:
	scripts/redirects.js --redirects conf/redirects.json --output build

htmlhint:
	htmlhint build

nunjucks:
	scripts/nunjucks.js pages/**/*.html

watch:
	scripts/server.js
	scripts/watch.js
	npm run test-watch

test: eslint
	npm test

build: clean fonts images public scss-build csslint redirects nunjucks htmlhint

deploy: build
	./scripts/deploy.js --region eu-west-1
