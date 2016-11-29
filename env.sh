rootPath=`pwd`
result=$(echo $GOPATH | grep $rootPath)
if [ ${#result} -le 0 ]; then
    export GOPATH=$GOPATH:$rootPath/server
fi 
