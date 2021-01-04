#! /bin/bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
version=$(cat $dir/package.json | grep \\\"version\\\" | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

if [ "$version" != "" ]; then
    if [ $(git tag -l "v$version") ]; then
        echo "Tag already exists (v$version)"
    else
        git tag -a "v$version" -m "`git log -1 --format=%s`"
        git push --tags
        echo "New tag pushed (v$version)"
    fi

fi