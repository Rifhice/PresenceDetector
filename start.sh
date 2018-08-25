processId=$(ps -ef | grep 'indexPresence' | grep -v 'grep' | awk '{ printf $2 }')
sudo kill -9 $processId
cd /home/pi/Desktop/Hom-E_Presence_Sensor/
git pull
node indexPresence.js
