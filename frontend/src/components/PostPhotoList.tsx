import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PostPhotoList({ postId, photo_set }: any) {
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

  return (
    <div>
      <Slider {...settings}>
        {photo_set.map((photo: any) => {
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
