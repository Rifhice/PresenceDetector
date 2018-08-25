from grovepi import *
import time
ultrasonic_ranger = 3

def isHomeFunction(data):
    nbFalse = 0
    for value in data:
        if value > 15:
            nbFalse = nbFalse + 1
            if nbFalse > 5:
                    return False
    return True

lastValues = [50]*10
i = 0
while i < 10:
    try:
        time.sleep(0.5)
        lastValues.append(ultrasonicRead(ultrasonic_ranger))
        if(len(lastValues) > 10):
            lastValues = lastValues[1:]
        i = i + 1
    except IOError as e: 
        print "I/O error({0}): {1}".format(e.errno, e.strerror)

print(isHomeFunction(lastValues))