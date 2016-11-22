all: build-server

build-server:
	cd server/src/github.com/zhongxuqi/lowtea/app/server && go build -o lowtea
	mv server/src/github.com/zhongxuqi/lowtea/app/server/lowtea .
