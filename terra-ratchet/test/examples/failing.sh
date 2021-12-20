#!/usr/bin/env bash
exec 2>&1
echo Some log
>&2 echo Failing
exit 1