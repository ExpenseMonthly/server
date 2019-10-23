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
from io import BytesIO
import requests


def url_to_image(url):
    resp = urllib.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # response = requests.get(url)
    # print( response.content )
    # image = Image.open(BytesIO(response.content))
    # image = np.asarray( image, dtype="uint8")
    # image = cv2.imdecode(image, cv2.IMREAD_COLOR)
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




urls = [
    "https://storage.cloud.google.com/final-project-phase-3/WhatsApp%20Image%202019-10-18%20at%2009.53.49.jpeg",
    "https://fastly.4sqi.net/img/general/600x600/63534182_-zi3nbfD1Z9M9u8WoDwr8bAMSe0cFhPQ7WnFe6z-SK4.jpg",
    "",
    ""
]

image = url_to_image (urls[1])
print( image )
result = pytesseract.image_to_string(image)
print( result )


# res_arr = result.split('\n')
# normalization_res = []
# for i in res_arr :
#     if len(i) >= 1 :
#         normalization_res.append( i )

# normalization_dict = []
# i = 0 
# array = []
# for res in normalization_res :
#     i += 1
#     if i == 1 :
#         normalization_dict.append({ 'address' : res })
#     elif i == 2 : 
#         normalization_dict.append({ 'region' : res })
#     elif i == 3 :
#         normalization_dict.append({ 'transactionDate' : res })
#     else : 
#         array.append( res )
# normalization_dict.append({ 'items' : array })

# print(json.dumps(normalization_dict, indent = 4, sort_keys=True))


