#!/bin/bash
#
# Build this project for production
#

set -e
set -u

BUILD_DIR=build/tree
SRC_DIR=src

cd "$(dirname "$0")"

# Clean
rm -rf "${BUILD_DIR}"

# Build
mkdir -p "${BUILD_DIR}"
npm install
npm run build

# Copy static assets
cp "${SRC_DIR}"/{favicon.ico,index.html} "${BUILD_DIR}"
