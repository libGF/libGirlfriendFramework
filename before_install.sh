#!/bin/bash

if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    openssl aes-256-cbc -K $encrypted_07aba4ee01ad_key -iv $encrypted_07aba4ee01ad_iv -in deploy.tar.enc -out deploy.tar -d
    tar xvf deploy.tar
    chmod u+x deploy.sh
fi
