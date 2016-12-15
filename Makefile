all: build-server

build-server:
	GOPATH=${CURDIR}/server:$(GOPATH) && go build -o ./bin/lowtea zhongxuqi/lowtea/app/server

run: build-server
	cd ./bin && ./lowtea

run-test: build-server
	cd ./bin && ./lowtea -f ../configs/mylowtea.conf
