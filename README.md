## Dependencies

```bash
npm install
```

## Running

```bash
npm start
```
To have the page **reload automatically every time you save** your changes, make sure you have the [fb-flo](https://chrome.google.com/webstore/detail/fb-flo/ahkfhobdidabddlalamkkiafpipdfchp?hl=en) chrome extension installed, and make sure the developer tools (the javascript console, or 'inspect element' pane) are open. Enjoy :-)

## Tests

```bash
npm test
```

## Prerequisites:

- node.js: `brew install node`
- Edit your ~/.bash_profile or ~/.zshrc:

```
PATH=node_modules/.bin:$PATH
```

# Structure (what to change)

The site url structure maps the `app/pages/` folder excluding the index.html file.

`app/pages/features/index.html` would end up at `gocardless.com/features/`

CSS: `app/css/`
JS: `app/js/`
Images: `app/images/`
Fonts: `app/fonts/`
Static app: `app/public/`
Page templates: `app/templates/`
Shared template includes/partials: `app/includes/`

# Troubleshooting

1. `npm start` fails

Try running `npm install`. Packages might be out of date.

2. `command` not found

Make sure you have reloaded your terminal after `2.` under `Setup to run locally`

3. Prospect forms are broken

You need to run gocardless at: gocardless.dev:3000

[http://localhost:9000/index.html](http://localhost:9000/index.html)

# Deploying

## Staging

Once a pull-request is merged it goes onto `dev` and gets deployed.
Deploys happen once CI tests pass. Circle CI will email about any failure.

## Production

#### ! DO NOT COMMIT/PUSH STRAIGHT TO MASTER !

Production is deployed once tests on the `master` branch pass. Merge `dev` into
`master` with `--no-ff` to deploy.

# Deploying manually

Set up AWS credentials (web ops):
```
export GC_AWS_ACCESS_KEY=ask webops
export GC_AWS_SECRET=ask webops
```

Testing:
```
$ AWS_S3_BUCKET=staging.gocardless.com make deploy
```

Production:
```
$ AWS_S3_BUCKET=gocardless.com make deploy
```
