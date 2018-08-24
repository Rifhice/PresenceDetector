# coding: utf-8
import socket
import sys 

socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
socket.bind(('127.0.0.1', 1110))

socket.listen(5)
client, address = socket.accept()
sys.stdout.write("{} connected".format( address ))
while True:
    response = client.recv(255)
    if response != "":
        sys.stdout.write("Python server received : {}".format(response))
        command = response.split(' ')[0]
        if command == 'set':
            arg = response.split(' ')[1]
            if arg == 'on':
                bulb.turn_on()
            elif arg == 'off':
                bulb.turn_off()
        client.send(response)

sys.stdout.write("Close")
client.close()
stock.close()