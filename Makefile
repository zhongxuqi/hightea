all: build-server

build-server:
	cd server/src/github.com/zhongxuqi/hightea/app/server && go build -o hightea
	mv server/src/github.com/zhongxuqi/hightea/app/server/hightea .
