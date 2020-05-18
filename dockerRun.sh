#!/bin/bash
docker container stop $(docker container ls -q)
docker system prune -f
docker run --name "ideht_proto" -p 80:80 "ideht_proto"
