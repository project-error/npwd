#!/usr/bin/env bash

export $(awk -F= '{output=output" "$1"="$2} END {print output}' .env)
# Check if $destination has been imported from .env
if [ -z "$destination" ]
then
  echo "Destination not set in .env"
  exit 1
fi


# Retrieve name from package.json
name=$(node -p "require('./package.json').name")

echo "Moving $name to destination $destination"

# Save as variable
source="./dist"

# Move source to destination
cp -Tr $source "$destination/$name"

