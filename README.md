# faceRecognition

A face recognition experiment in JavaScript using my [neural network](https://github.com/victorqribeiro/mlp).

[![groupImg](http://img.youtube.com/vi/KzXpdcOYwv0/0.jpg)](http://www.youtube.com/watch?v=KzXpdcOYwv0)

## Capture Data

captureData.html - Get image data from the webcam.

on the *label* input, entry the label in the one-hot encoded hormat. 
e.g.: [1,0] if something is A - [0,1] if something is B.

### How to use it
c - capture the current frame and add it to the data set.  
s - save the data set (x, y) as x and y .json files.  
u - undo. remove the last entry from the data set.  

## Fit Data

fitData.html - Train the neural network with the data created in captureData.html

## Test Data

testData.html - Test the neural network with new images from the webcam.

## Important Info

The *nn.json* model provided in this repo may not work for you, since it was only trained with 80 images of myself. 
40 images of me in front of the computer, 40 of me not in front of the computer.
The images ware scale to 32x24 pixels before traingin and during test.
