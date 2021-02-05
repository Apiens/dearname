// @ts-ignore
// ts ignore to avoid type error caused by error in library. (exif.d.ts)
import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "store";
import { Form, Input, Upload, message, Modal, Button, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import EXIF from "exif-js";
import "./PostCreate.scss";
import { axiosInstance } from "api";
import { PREDICT_API_HOST } from "Constants";

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

interface dict {
  [key: string]: any;
}

const { Option } = Select;
export default function PostCreate(this: any, { postId }: any) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [subject_species_pk, setSubjectSpeciesPk] = useState("");
  const [speciesPrediction, setSpeciesPrediction] = useState<Object>({});
  const [sortedPrediction, setSortedPrediction] = useState<any>([]);
  const [searchResult, setSearchResult] = useState<Object[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState(undefined);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [birdDict, setBirdDict] = useState<dict>({});

  const [form] = Form.useForm();

  const apiUrl = `/api/posts/`;
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = useMemo(() => {
    return { Authorization: `JWT ${jwtToken}` };
  }, [jwtToken]);

  useEffect(() => {
    console.log("useEffect after component mount");
    const fx = async () => {
      const fetched_birdDict = await axiosInstance
        .get("/api/bird_dict", {
          headers,
        })
        .then((response) => {
          console.log("birdDict fetched_data. response:", response);
          console.log("birdDict fetched_data", response.data);
          return response.data;
        })
        .catch((error) => {
          message.info(
            "종 목록을 불러오는데 실패했습니다. 페이지를 새로고침(F5) 해 주세요."
          );
          console.log(
            "error while fetching birdDict. error.response: ",
            error.response
          );
        });
      setBirdDict(fetched_birdDict);
    };
    fx();
  }, [headers]);

  const [exifList, setExifList] = useState<Object[]>([]);
  useEffect(() => {
    console.log("useEffect after FileList");
    // console.log("file_list: ", fileList);
    for (const [index, file] of fileList.entries()) {
      EXIF.getData(file.originFileObj, () => {
        const metaData = EXIF.getAllTags(file.originFileObj);
        console.log("index: ", index);
        console.log("metaData: ", metaData);
        setExifList((prevExifList) => {
          prevExifList[index] = metaData;
          return prevExifList;
        });
      });
    }
  }, [fileList]);

  const handleChange = (param: any) => {
    console.log("Upload Changed. param: ", param);
    console.log("execute setFileList()");
    setFileList(param.fileList);

    //Scoring prediction. Score 3,2,1 to Top1,2,3 respectively.
    if (param.file.status === "done") {
      param.file.response &&
        param.file.response.forEach((response: string, index: any) => {
          setSpeciesPrediction((prevValue: any) => {
            console.log("prevValue", prevValue);
            const newValue: any = { ...prevValue };
            newValue[response] = prevValue[response]
              ? prevValue[response] + 3 - index
              : 3 - index;
            console.log("newValue:", newValue);
            return newValue;
          });
        });
    } else if (param.file.status === "removed") {
      param.file.response &&
        param.file.response.forEach((response: any, index: any) => {
          setSpeciesPrediction((prevValue: any) => {
            const newValue: any = { ...prevValue };
            newValue[response] = prevValue[response] - 3 + index;
            newValue[response] === 0 && delete newValue[response];
            return newValue;
          });
        });
    }
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

  const onSubmit = async (fieldValues: any) => {
    try {
      console.log("fieldValues: ", fieldValues);

      const formData = new FormData();
      formData.append("subject_species_pk", subject_species_pk);
      formData.append("location", location);
      formData.append("caption", caption);

      fileList.forEach(async (file: any) => {
        formData.append("photo_set", file.originFileObj);
      });
      console.log("exifList: ", exifList);

      exifList.forEach((metadata) => {
        console.log("metadata before axios: ", metadata);
        formData.append("photo_metadata_set", JSON.stringify(metadata));
      });

      console.log("entries: ", formData.entries());
      const response = await axiosInstance.post(
        apiUrl,
        formData,
        // { caption, location, subject_species_pk, photo_set },
        { headers }
      );
      console.log("post_succecss. response: ", response);
      message.success("성공! 포스팅이 게시되었습니다.");
      //TODO: add message

      setFileList([]);
      setExifList([]);
      setLocation("");
      setSubjectSpeciesPk("");
      setCaption("");
      setSpeciesPrediction({});
      setSearchResult([]);
      setSelectedSpecies(undefined);
    } catch (error) {
      message.error(
        "포스팅 게시에 실패했습니다. 페이지 새로고침(F5) 후 다시 작성해 주세요."
      );
      console.log("error. error.response: ", error.response);
    }
  };

  useEffect(() => {
    console.log("l,s,c:", location, subject_species_pk, caption);
  }, [location, subject_species_pk, caption]);

  // TODO: Dragger를 통한 multiupload와 함께 Cropper 기능 제공.
  // (picture-card list에 등록되기 전 cropper로 선처리)
  // Dragger에 multi image 등록시 작동 순서. before upload-> picture-card -> fileList ...?
  useEffect(() => {
    const sorted = Object.entries(speciesPrediction).sort(
      ([, a], [, b]) => b - a // reverse of a-b
    );
    console.log("sorted:", sorted);
    setSortedPrediction(sorted);
  }, [speciesPrediction]);

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      style={{
        width: "64%",
        minWidth: "300px",
        marginTop: "20%",
        marginBottom: "20%",
      }}
    >
      <Form.Item>
        <ImgCrop grid rotate quality={1.0}>
          <Upload.Dragger
            action={PREDICT_API_HOST + "/predict/birds"}
            headers={headers}
            // multiple={true} // TODO: find a way to enable multiple with ImgCrop.
            listType="picture-card"
            // beforeUpload={() => false}
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
        </ImgCrop>
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
        <Select
          value={selectedSpecies}
          allowClear={true}
          optionFilterProp="value"
          showSearch
          style={{ width: "100%" }}
          placeholder="종을 선택해 주세요"
          onSearch={(input) => {
            console.log("search");
            setSearchResult([]);
            const filtered_bird_dict = Object.values(birdDict).filter(
              (bird_info) => {
                return bird_info[2].indexOf(input) >= 0;
              }
            );
            console.log("filtered_bird_dict", filtered_bird_dict);
            setSearchResult(filtered_bird_dict);
          }}
          onSelect={(value: any, option) => {
            setSelectedSpecies(value);
            setSubjectSpeciesPk(option.speciespk);
          }}
          filterOption={(input: any, option: any) =>
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {console.log(JSON.stringify(sortedPrediction))}
          {sortedPrediction.map((prediction: string[], index: number) => {
            return (
              index < 3 && (
                <Option
                  value={birdDict[prediction[0]][2]}
                  speciespk={birdDict[prediction[0]][4]}
                >
                  <span>
                    <strong>{birdDict[prediction[0]][2]}</strong>
                  </span>
                  <span style={{ float: "right" }}>
                    <strong>AI Score {prediction[1]}</strong>
                  </span>
                </Option>
              )
            );
          })}
          {searchResult.map((bird: any) => {
            return (
              !sortedPrediction
                .slice(0, 3)
                .map((value: any) => value[0])
                .includes(bird[0]) && (
                <Option value={bird[2]} speciespk={bird[4]}>
                  <span>{bird[2]}</span>
                </Option>
              )
            );
          })}
        </Select>
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
