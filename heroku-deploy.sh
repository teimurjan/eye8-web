#!/bin/sh
heroku container:push web --app bigsty-react
heroku container:release web --app bigsty-react