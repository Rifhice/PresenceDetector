# GrovePi + Grove Ultrasonic Ranger
import time
from grovepi import *
import threading
import socket
uuid = "1ec3b2ba-a558-11e8-98d0-529269fb1459"
class EntranceUltrasonic(threading.Thread):

    def __init__(self,host,port):
        threading.Thread.__init__(self)
        self.ultrasonic_ranger = 3

        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	self.port = port
        self.host = host
        self.s.connect((self.host, self.port))

    def performAction(self,action):
        self.s.send(str(uuid) + "/#/" + str(action))

    def isHomeFunction(self,data):
        nbFalse = 0
        for value in data:
            if value > 15:
                nbFalse = nbFalse + 1
                if nbFalse > 5:
                        return False
        return True

    def run(self):
        self.isHome = False
        self.performAction("false")
	
        lastValues = [50]*10
        print lastValues
        while True:
            try:
                time.sleep(1)
                print lastValues
                lastValues.append(ultrasonicRead(self.ultrasonic_ranger))
                if(len(lastValues) > 10):
                    lastValues = lastValues[1:]
                if self.isHomeFunction(lastValues):
                    print "Keys are in place !"
                    if not(self.isHome):
                        self.performAction("true")
                        self.isHome = True
                else:
                    print "Keys aren't in place !"
                    if self.isHome:
                        self.performAction("false")
                        self.isHome = False
            except KeyboardInterrupt:
		print("error")
                break
            except IOError as e:
		print "I/O error({0}): {1}".format(e.errno, e.strerror)

port = 1110
host = "127.0.0.1"
ultrasonic = EntranceUltrasonic(host,port)
ultrasonic.start()
