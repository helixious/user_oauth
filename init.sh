#!/bin/sh
FILE=/secrets/.env
if [ -f $FILE ]; then
    cp $FILE .
else
    echo "the file '${FILE}' does not exist"
fi
