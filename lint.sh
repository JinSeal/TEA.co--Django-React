#!/bin/sh

eslint --fix .

pylint --load-plugins pylint_django ./home
pylint --load-plugins pylint_django ./core