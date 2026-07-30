source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

gem "github-pages", group: :jekyll_plugins

# If you want to use Jekyll native, uncomment the line below.
# To upgrade, run `bundle update`.

# gem "jekyll"

# wdm is the Windows file-watcher used by `jekyll serve`. 0.1.x does not build
# against Ruby 3.x; 0.2.0 does. Windows-only, so this does not affect the
# GitHub Pages build.
gem "wdm", "~> 0.2.0" if Gem.win_platform?
gem "webrick"

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw]

# If you have any plugins, put them here!
group :jekyll_plugins do
  # gem "jekyll-archives"
  gem "jekyll-feed"
  gem 'jekyll-sitemap'
  gem 'hawkins'
end
