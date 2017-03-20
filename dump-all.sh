#/bin/bash
echo "begin..."
if [ $# -ne 3 ]; then
    echo "error args: dump-all.sh <mongohost> <mongodb> <mediaPath>"
    exit 1
fi

if [ ! -x `pwd`/dumps ]; then
    echo "dumps not found"
    mkdir dumps
fi

if [ -x `pwd`"/tmp" ]; then
    rm -rf tmp
    mkdir tmp
else
    mkdir tmp
fi

pushd tmp
mongodump --host $1 -d $2 -o .
tarname=`date +%Y-%m-%dT%H-%M-%S`".tar.gz"
tar zcvf $tarname $2 $3
mv $tarname ../dumps/
popd
echo "end..."