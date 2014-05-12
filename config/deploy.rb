require 'capistrano/ext/multistage'
require 'capistrano/s3'
require 'capistrano/recipes/deploy/strategy/copy'

set :stages, %w( production staging )
set :default_stage, 'staging'

set :application, 'gocardless-blog'

unless ENV['GC_AWS_ACCESS_KEY'] && ENV['GC_AWS_SECRET']
  abort "Before continuing you need to create some environment variables : \n" +
        "- $GC_AWS_ACCESS_KEY\n" +
        "- $GC_AWS_SECRET\n\n" +
        "Ask a devops if you don't know where to find these"
end

set :access_key_id, ENV['GC_AWS_ACCESS_KEY']
set :secret_access_key, ENV['GC_AWS_SECRET']
set :s3_endpoint, 's3-eu-west-1.amazonaws.com'

namespace :deploy do

  task :compile do
    system 'JEKYLL_ENV=production jekyll build --destination public'
  end

  task :clean do
    system 'rm -rf public'
    system 'rm -rf .last_published'
  end

  task :default do
    transaction do
      compile
      update
      clean
    end
  end

end
