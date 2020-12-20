import Axios from "axios";
import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";

export default function PostPhotoList({ postId }: any) {
  const apiUrl = `http://localhost:8000/api/posts/${postId}/photos`;
  const [photoList, setPhotoList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: photos }: any = await Axios.get(apiUrl);
        console.log("photos: ", photos);
        setPhotoList(photos);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  //   const [{ data: photos, loading }] = useAxios(apiUrl);

  //   useEffect(() => {
  //     setPhotoList(photos);
  //   }, [photos]);

  return (
    <div>
      <h4>PostPhotoList</h4>
      {console.log("rendering photolist with photoList: ", photoList)}
      {/* {console.log("rendering photolist with loading: ", loading)} */}
      {photoList.map((photo: any) => {
        return (
          <img
            src={photo.url}
            alt=""
            style={{ width: "100px", height: "100px" }}
          />
        );
      })}
    </div>
  );
}
