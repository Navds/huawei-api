#!/bin/bash

js=( changelang.js checklogin.js country.js deviceinformation.js dhcp.js dmzsettings.js 
firewallswitch.js home.js lanipfilter.js main.js messagesetting.js mobileconnection.js 
mobilenetworksettings.js modifypassword.js nat.js pincodemanagement.js ping.js 
profilesmgr.js quicksetup.js redirect.js sipalgsettings.js sms.js specialapplication.js 
statistic.js systemsettings.js table.js update.js upnp.js validation.js virtualserver.js 
wlanadvanced.js wlanbasicsettings.js wlanmacfilter.js )

url="http://192.168.1.1/js/"
folder="./js/"

for file in "${js[@]}"
do
        wget "$url$file" -O $folder$file.gz; gunzip $folder$file.gz
done
