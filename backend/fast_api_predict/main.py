# from fastapi import FastAPI, Form
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf

app = FastAPI()

origins = [
    "https://dearname.app",
    "ddec3rgmn9iic.cloudfront.net",
    "http://localhost:8000",
    "http://localhost:8008",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tf_model = tf.keras.models.load_model("./v0.0.2_over100(327 species)_Oct.18.1107.h5")


# is it possible to remove numpy part into a separate function and decorate with numba? => much faster??
# -> Give it a try and analyze!
# def to_array()
# def sort_result(arr:np.array)->List[int]:


# with open("species_info_dict.pkl", "rb") as f:
#     import pickle
#     species_info_dict: dict = pickle.load(f)


@app.post("/predict/birds")
async def predict_bird(file: UploadFile = File(...)):
    img = file.file
    pil_img = Image.open(img).convert("RGB").resize((456, 456))
    # pil_img.show()
    nd_array = np.expand_dims(np.array(pil_img) / 255.0, axis=0)
    result = tf_model.predict(nd_array)
    result_top3 = np.argsort(result, axis=1)[0, ::-1][:3] + 1

    return ["AV_000" + f"{result:0>3}" for result in result_top3]  # {"data": }


@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}