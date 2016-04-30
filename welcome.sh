#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "message":{
        "text":"空虛、寂寞、覺得冷嗎？你可以跟我說說話喔>///<"
      }
    }
  ]
}' "https://graph.facebook.com/v2.6/libGF/thread_settings?access_token=`cat accessToken`"
