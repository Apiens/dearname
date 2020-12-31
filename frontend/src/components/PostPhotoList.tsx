import Axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppContext } from "store";

export default function PostPhotoList({ postId }: any) {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };

  const apiUrl = `http://localhost:8000/api/posts/${postId}/photos/`;
  const [photoList, setPhotoList] = useState([]);
  // carousel settings
  const settings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // adaptiveHeight: true,
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: photos }: any = await Axios.get(apiUrl, { headers });
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
      <Slider {...settings}>
        {photoList.map((photo: any) => {
          return (
            <div>
              <img
                src={photo.url}
                alt=""
                style={{
                  width: "600px",
                  height: "600px",
                }}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
//       {/* <h4>PostPhotoList</h4> */}
//       {/* {console.log("rendering photolist with photoList: ", photoList)} */}
//       {/* {console.log("rendering photolist with loading: ", loading)} */}
