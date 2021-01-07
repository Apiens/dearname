import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAppContext } from "store";
import { Form, Input, Upload, message, Modal, Button } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import EXIF from "exif-js";
import "./PostCreate.scss";
import { ExitStatus } from "typescript";
import { useHistory } from "react-router-dom";

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export declare type UploadFileStatus =
  | "error"
  | "success"
  | "done"
  | "uploading"
  | "removed";
export interface UploadFile<T = any> {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: T;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: T;
  preview?: string;
}

export default function PostCreate(this: any, { postId }: any) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [subject_species_pk, setSubjectSpeciesPk] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const history = useHistory();

  // this seems very inefficient but extracting exif in onSubmit didn't work well.
  // also it turns out something happens when uplaod multiple images at once.
  // when multiple images are uploaded at once, filelist seems to stay as orer of first finish first in.(async result.)
  // so setExifList() is called in improper order.
  // if I add another file or delete a file, then the fileList is ordered in first-in first in order(sync result.)
  // problem will rise when some images has exif and others don't. (and they are uploaded together.)
  // to avoid this, I had to put the for loop inside the setTimeOut's callback.
  // and eventough i put it into setTimeOut. it didn't work.

  // 내 목표 -> fileList에 저장된 사진순서대로 exifList만들기. forEach, for of, map 다 이런저런 이유로 실패..
  // index랑 같이 저장해서 index기준으로 sort하는건 가능하겠다.. (결국 이렇게 함: push가 아니라 index로 넣기!)
  // 추측컨데 EXIF.getData에서 파일 IO가 일어나고 그래서 비동기 처리가 되나보다.
  // 그냥 비동기를 반목문 안에서 제어하려고 하면 좋을게 없는데 내가 그렇게 쓰려고 한 것 부터가 잘못인듯?
  const [exifList, setExifList] = useState<Object[]>([]);
  useEffect(() => {
    // console.log("file_list: ", fileList);
    for (const [index, file] of fileList.entries()) {
      EXIF.getData(file.originFileObj, () => {
        const metaData = EXIF.getAllTags(file.originFileObj);
        console.log("index: ", index);
        console.log("metaData: ", metaData);
        setExifList((prevExifList) => {
          // prevExifList.push(metaData);
          prevExifList[index] = metaData;
          return prevExifList;
        });
      });
    }

    // setExifList((prevExifList) => {
    //   prevExifList.push(metaData);
    //   return prevExifList;
    // })

    // this one will not work properly as forEach will call the callbacks asynchronously.
    // first finish first in. not first in first in.

    // fileList.forEach((file: any) => {
    //   EXIF.getData(file.originFileObj, () => {
    //     const metaData = EXIF.getAllTags(file.originFileObj);
    //     console.log("metaData: ", metaData);
    //     setExifList((prevExifList) => {
    //       prevExifList.push(metaData);
    //       return prevExifList;
    //     });
    //   });
    // });
  }, [fileList]);

  const handleChange = (param: any) => {
    console.log("Upload Changed. param: ", param);
    setFileList(param.fileList);
  };
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleCancel = () => setPreviewVisible(false);

  const apiUrl = `http://localhost:8000/api/posts/`;
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const onSubmit = async (fieldValues: any) => {
    // adding fileList as photo_set.
    // console.log("fileList: ", fileList);

    // // This one doesn't work.
    // const photo_set: any = [];
    // fileList.forEach((file: any) => {
    //   photo_set.push({ url: file.originFileObj })
    // });
    // formData.append("photo_set", photo_set);

    // But this one works.
    try {
      console.log("fieldValues: ", fieldValues);
      // const {
      //   caption,
      //   location,
      //   species: subject_species_pk,
      //   fileList: { fileList },
      // } = fieldValues;
      // // it's possible to get data from fieldValues but also possible form state.

      const formData = new FormData();
      formData.append("subject_species_pk", subject_species_pk);
      formData.append("location", location);
      formData.append("caption", caption);

      fileList.forEach(async (file: any) => {
        //adding file
        formData.append("photo_set", file.originFileObj);
        // Extracting and adding EXIF metadata.
        // putting getTags() in callback dosn't work.
        // 소스코드 보면 동기식 callback이라 되야하는데 왜 비동기 callback처럼 작용하는지 모르겠음(콜백 바로 안부르고 다음코드실행함..).
        // EXIF.getData(file.originFileObj, () => {
        //   // find data from img and add it to img.exifdata.
        //   const metaData = EXIF.getAllTags(file.originFileObj); // get tags from img.exifdata and return
        //   formData.append("photo_metadata_set", JSON.stringify(metaData));
        //   console.log("metaData: ", metaData);
        // });
      });
      console.log("exifList: ", exifList);

      exifList.forEach((metadata) => {
        console.log("metadata before axios: ", metadata);
        formData.append("photo_metadata_set", JSON.stringify(metadata));
      });

      console.log("entries: ", formData.entries());
      const response = await Axios.post(
        apiUrl,
        formData,
        // { caption, location, subject_species_pk, photo_set },
        { headers }
      );
      console.log("post_succecss. response: ", response);

      //TODO: add message

      setFileList([]);
      setExifList([]);
      setLocation(" ");
      setSubjectSpeciesPk(" ");
      setCaption(" ");

      // history.push("/");
    } catch (error) {
      console.log("error. error.response: ", error.response);
    }
  };

  useEffect(() => {
    console.log("l,s,c:", location, subject_species_pk, caption);
  }, [location, subject_species_pk, caption]);

  return (
    <Form
      onFinish={onSubmit}
      style={{
        width: "64%",
        minWidth: "300px",
        marginTop: "20%",
        marginBottom: "20%",
      }}
    >
      <Form.Item name="fileList">
        <Upload.Dragger
          // action=""
          // headers=""
          multiple={true}
          listType="picture-card"
          beforeUpload={() => false}
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">클릭 또는 드래그하여 업로드</p>
          <p className="ant-upload-hint">
            당신이 만난 대상의 사진을 올려주세요.
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <Form.Item>
        <Input
          placeholder="종을 입력해 주세요."
          value={subject_species_pk}
          onChange={(e) => {
            setSubjectSpeciesPk(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item>
        <Input
          placeholder="장소를 입력해 주세요."
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item>
        <Input.TextArea
          rows={4}
          placeholder="소감을 입력해 주세요."
          maxLength={200}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
          value={caption}
        />
      </Form.Item>
      <Form.Item style={{ width: "25%", minWidth: "150px", margin: "auto" }}>
        <Button type="primary" block={true} htmlType="submit">
          작성완료
        </Button>
      </Form.Item>
    </Form>
  );
}

// FYI: EXIF includes following +@ data.
//DateTimeOriginal
//Create Date?
//ExposureTime
//ShutterSpeedValue
//FNumber
//ISOSpeedRatings
//ApertureValue // lens aperature value
//Make //maker?
//Model
//Artist
//GPSaltitude
//GPSlongitude
//GPSlatitude
