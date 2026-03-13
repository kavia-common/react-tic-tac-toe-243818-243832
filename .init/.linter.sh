#!/bin/bash
cd /home/kavia/workspace/code-generation/react-tic-tac-toe-243818-243832/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

