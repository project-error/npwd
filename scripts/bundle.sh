

# Retrieve name from package.json
name=$(node -p "require('./package.json').name")

# Save as variable
destination="./dist"

echo "Bundling $name"

# Remove old bundle
rm -rf $destination

# Copy dist
mkdir $destination
cp -r src/client/dist $destination/client
cp -r src/server/dist $destination/server
cp -r src/ui/dist $destination/ui

# Copy config files
cp config.json $destination
cp fxmanifest.lua $destination