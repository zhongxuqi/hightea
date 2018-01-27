all: build-server

build-server:
	GOPATH=${CURDIR}/server:$(GOPATH) && go build -o ./bin/lowtea zhongxuqi/lowtea/app/server

build-front:
	cd front && npm install && webpack --define process.env.NODE_ENV="'production'"

build-all: build-server build-front

run: build-server
	cd ./bin && ./lowtea

run-test: build-server
	cd ./bin && ./lowtea -f ../configs/default.conf
