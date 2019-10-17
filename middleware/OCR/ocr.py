try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract

import numpy as np
import urllib
import cv2
import imutils
import json

def url_to_image(url):
    resp = urllib.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

def pre_processing ( image ):
    original_image = image.copy()

    image = cv2.resize(image, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)

    image_yuv =cv2.cvtColor( image, cv2.COLOR_RGB2BGR )
    image_y = np.zeros(image_yuv.shape[0:2], np.uint8)
    image_y[: ,:] = image_yuv[ : , : , 0]

    # Smoothing
    image_blurred = cv2.GaussianBlur(image_y, (3, 3), 0)

    ret,thresholded_image = cv2.threshold(image,127,255,cv2.THRESH_TOZERO)

    cv2.imshow ("result" , thresholded_image)
    cv2.waitKey(0)
    return thresholded_image





image = url_to_image ("https://fastly.4sqi.net/img/general/600x600/63534182_-zi3nbfD1Z9M9u8WoDwr8bAMSe0cFhPQ7WnFe6z-SK4.jpg")
result = pytesseract.image_to_string(image)
print ( "result ")
print ( "====================")
# print( result )


res_arr = result.split('\n')
for i in res_arr :
    if len(i) >= 1 :
        print ( "%s" % ( i ))
