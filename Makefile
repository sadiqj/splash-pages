# Re-write existing GC aws credentials to work with awc-cli
AWS_ACCESS_KEY_ID ?= $(GC_AWS_ACCESS_KEY)
AWS_SECRET_ACCESS_KEY ?= $(GC_AWS_SECRET)

AWS_DEFAULT_REGION = eu-west-1
AWS_DEFAULT_OUTPUT = text

LIVE_PRODUCTION = "live-production"
LIVE_PRODUCTION_BUCKET = "s3://gocardless.com/"
LIVE_STAGING_BUCKET = "s3://staging.gocardless.com/"
LIVE_PRODUCTION_URL = "https://gocardless.com"
LIVE_STAGING_URL = "https://staging.gocardless.com"

ifeq ($(target), LIVE_PRODUCTION)
	TARGET_BUCKET = $(LIVE_PRODUCTION_BUCKET)
	TARGET_URL = $(LIVE_PRODUCTION_URL)
else
	TARGET_BUCKET = $(LIVE_STAGING_BUCKET)
	TARGET_URL = $(LIVE_STAGING_URL)
endif

BUILD_TARGET = "build/"
DEPLOY_CMD_ARGS = --acl=public-read \
									--delete \
									--cache-control="max-age=0, no-cache" \
									--include "*"
DEPLOY_CMD = aws s3 sync $(BUILD_TARGET) $(TARGET_BUCKET) $(DEPLOY_CMD_ARGS)

clean:
	rm -rf $(BUILD_TARGET)

build: clean
	gulp build

deploy: build
	@echo "Deploying $(target) to $(TARGET_URL)"
	$(DEPLOY_CMD)
	@echo "Successfully deployed $(target) to $(TARGET_URL)"

dryrun:
	$(DEPLOY_CMD) --dryrun
