# pip3 install opencv-python
# https://towardsdatascience.com/read-text-from-image-with-one-line-of-python-code-c22ede074cac
# https://www.youtube.com/watch?v=4DrCIVS5U3Y

import cv2
import pytesseract as tess
tess.pytesseract.tesseract_cmd = r'C:\Users\mfenn\AppData\Local\Tesseract-OCR\tesseract.exe'
import os
import json

def getWords(img):
    text = tess.image_to_string(img)
    removedText = text.strip()
    lineSplit = removedText.splitlines()
    str_list = list(filter(None, lineSplit))
    return str_list

allPeople = []
allWorld = []
allObject = []
allAction = []
allNature = []
allRandom = []
badFilenames = []

for filename in os.listdir(os.getcwd()):
    if filename.endswith(".jpg"): 
        words = getWords(filename)
        print("filename", filename)
        print ("words", words)
        print("")
        if (len(words) >= 6):
            allPeople.append(words[0])
            allWorld.append(words[1])
            allObject.append(words[2])
            allAction.append(words[3])
            allNature.append(words[4])
            allRandom.append(words[5])
        else:
            badFilenames.append(filename)

with open('badFilenames.json', 'w') as f:
    json.dump(badFilenames, f)

with open('people.json', 'w') as f:
    json.dump(allPeople, f)

with open('world.json', 'w') as f:
    json.dump(allWorld, f)

with open('object.json', 'w') as f:
    json.dump(allObject, f)

with open('action.json', 'w') as f:
    json.dump(allAction, f)

with open('nature.json', 'w') as f:
    json.dump(allNature, f)

with open('random.json', 'w') as f:
    json.dump(allRandom, f)

print ("Script completed")