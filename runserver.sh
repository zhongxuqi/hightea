#!/usr/bin/env bash

pushd ./bin
if [ -e web.pid ]; then
  kill `cat web.pid`
  sleep 2
fi
nohup ./lowtea -f default.conf > ./access.log 2>./err.log & 
echo $! > web.pid &
popd

