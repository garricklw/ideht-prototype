#!/bin/bash
$(sudo aws ecr get-login --no-include-email --region us-east-1)
docker build -t percsol/ideht:prototype .
docker tag percsol/ideht:prototype 935551085518.dkr.ecr.us-east-1.amazonaws.com/percsol/ideht:prototype
docker push 935551085518.dkr.ecr.us-east-1.amazonaws.com/percsol/ideht:prototype
