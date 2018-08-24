#!/usr/bin/env python# coding: utf-8

import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("127.0.0.1", 1110))
uuid = "1ec3b2ba-a558-11e8-98d0-529269fb1459"
print("Ecrivez votre message :")
while True:
    message = raw_input(">> ") # utilisez raw_input() pour les anciennes versions py$s.send(message)
    r = s.send(str(uuid) + "/#/" + str(message))
s.close()