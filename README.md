# Setup to run locally

- Install Node.JS: http://nodejs.org/download/ (v.0.10.x)

- Edit your ~/.bash_profile or ~/.zshrc:
```
PATH=node_modules/.bin:$PATH
```

- Install required packages:
```
$ npm install
```

# First time setup

```
$ make setup
```

This writes to `/etc/launchd.conf` and increases the limits for both values automatically.

# Running locally:

```
$ make watch
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

1. `make watch` fails

Try running `npm install`. Packages might be out of date.

2. `command` not found

Make sure you have reloaded your terminal after `2.` under `Setup to run locally`

3. Too many open file error

The task that watches the files you are working on can open a large number of
files, this can hit the maximum limit in OS X.

To adjust the maximum open file limits in OS X 10.7 (Lion) or newer, edit
`/etc/launchd.conf` and increase the limits for both values as appropriate.
```
limit maxfiles 16384 32768
```

Save the file, and restart the system for the new limits to take effect.
After restarting, verify the new limits with the launchctl limit command:

```
launchctl limit maxfiles

    maxfiles    16384          32768
```

4. Prospect forms are broken

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
export GC_AWS_ACCESS_KEY=ask webops
```

Testing:
```
$ AWS_S3_BUCKET=staging.gocardless.com make deploy
```

Production:
```
$ AWS_S3_BUCKET=gocardless.com make deploy
```
