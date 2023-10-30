#!/bin/sh
set -e
cd frontend && npm install && npm run build && cd ..
rm -rf p8hub/frontend-dist || true
mv frontend/out p8hub/frontend-dist
