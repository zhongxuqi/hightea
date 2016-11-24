all: build-server

build-server:
	GOPATH=$(GOPATH):${CURDIR}/server && go build -o ./bin/lowtea zhongxuqi/lowtea/app/server

run: build-server
	cd ./bin && ./lowtea
