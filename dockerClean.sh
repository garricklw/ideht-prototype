#!/bin/bash
docker container stop $(docker container ls -q)
docker system prune -f
