from fastapi import FastAPI, File, UploadFile
import numpy as np
from PIL import Image
import uvicorn
import tensorflow as tf
import cv2
import io
from starlette.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    # "http://localhost.tiangolo.com",
    # "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model('../savedModels/1')
@app.get("/ping")

async def bing():
    return "Hello, the server is alive"


def display_image(image):
#  print(image.shape) 
   cv2.imshow("test image", image)
   cv2.waitKey(0)
   cv2.destroyAllWindows()
    
def read_files_as_images(iamge_bytes):
   image_file = cv2.imdecode(np.frombuffer(iamge_bytes, dtype = np.uint8), cv2.IMREAD_ANYCOLOR)
#    display_image(image_file)
#    print(image_file)
#    print(image_file.shape) #(512, 512, 3)
   return image_file

def Image_input_preprocess(image_file):
    x = np.zeros((1, 256, 256, 3), dtype=np.float32)
    image = cv2.resize(image_file, (256, 256))
    # print(image.shape)
    x[0] = image
    image = image / 255
    # print(image.shape)
    return image

def prediction_output_Image_viewer(pred_im):
    cv2.imshow('iamge', pred_im)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# ===============Prediction End Point======================
@app.post("/predict")
async def predect(file: UploadFile= File(...)):
    uploaded_image_bytes = await file.read()
    image_file = read_files_as_images(uploaded_image_bytes) 
    image_batch = Image_input_preprocess(image_file) #preparing image as a batch by adding a diminsion to be provided to the model.predict
    model_image = np.expand_dims(image_batch,0)
    prediction_res = MODEL.predict(model_image) 

    p_mask = prediction_res[0].astype(np.uint8)*255
    predictedMusk = cv2.resize(p_mask ,(512,512))
    
    # prediction_output_Image_viewer(predictedMusk)

    res, img_png  = cv2.imencode(".png", p_mask)
    return StreamingResponse(io.BytesIO(img_png.tobytes()), media_type="image/png")


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8080)





    


            


