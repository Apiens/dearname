import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAppContext } from "store";
import { Card, message } from "antd";
import "./UserCollections.scss";

interface dict {
  [key: string]: any;
}
const { Meta } = Card;
export default function UserCollections() {
  const [myCollection, setMyCollection] = useState<Object[]>([]);
  const [birdDict2, setBirdDict2] = useState<dict>({});
  const apiUrl = "http://localhost:8000/api/mycollection";
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  // const { data: originalMyCollection }: any = Axios.get(apiUrl, { headers });
  // console.log("originalMyCollection: ", originalMyCollection);

  const noviceBook = [
    "청둥오리",
    "흰뺨검둥오리",
    "흰죽지",
    "고방오리",
    "비오리",
    "물닭",
    "쇠백로",
    "중대백로",
    "왜가리",
    "해오라기",
    "박새",
    "쇠박새",
    "곤줄박이",
    "동고비",
    "오목눈이",
    "붉은머리오목눈이",
    "까치",
    "어치",
    "큰부리까마귀",
    "멧비둘기",
    "꿩",
    "오색딱다구리",
    "개똥지빠귀",
    "알락할미새",
    "가마우지",
    "뿔논병아리",
    "참새",
    "방울새",
    "황조롱이",
    "딱새",
  ];

  useEffect(() => {
    const fx = async () => {
      const fetched_birdDict = await Axios.get(
        "http://localhost:8000/api/bird_dict2",
        {
          headers,
        }
      )
        .then((response) => {
          // console.log("birdDict fetched_data. response:", response);
          // console.log("birdDict fetched_data", response.data);
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
      setBirdDict2(fetched_birdDict);
    };
    fx();
  }, []);

  useEffect(() => {
    const fx = async () => {
      try {
        const { data } = await Axios.get(apiUrl, { headers });
        setMyCollection(data);
      } catch (error) {
        console.log(
          "Error while fetching data. error.response: ",
          error.response
        );
      }
    };
    fx();
  }, [birdDict2]);

  return (
    <main style={{ width: "100%" }}>
      {/* <div style={{width: "100%", height: "20px", border-bottom: "1px solid black", text-align: "center"}}>
        <span style={{font-size: 40px" background-color: "#F3F5F6", padding: "0 10px"}}>
          Section Title 
        </span>
      </div> */}
      <div
        style={{
          width: "100%",
          height: "20px",
          borderBottom: "1px solid black",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            backgroundColor: "#F3F5F6",
            padding: "0 10px",
          }}
        >
          요약
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "20px",
          borderBottom: "1px solid black",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            backgroundColor: "#F3F5F6",
            padding: "0 10px",
          }}
        >
          초급 새도감{" "}
          {
            noviceBook.filter((species) =>
              myCollection
                .map(
                  (species: any) =>
                    species.species < 536 && birdDict2[species.species]
                )
                .map((bird) => bird[2])
                .includes(species)
                ? true
                : false
            ).length
          }
          /30
        </span>
      </div>
      <section
        className="my_book"
        style={{
          width: "100%",
          // display: "grid",
          // gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          // gap: "1 em",
          // justifyItems: "center",
          // justifyItems: "center",
          display: "flex",
          flexWrap: "wrap",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
      >
        {noviceBook.map((speciesKOR: any, index: number, noviceBook) => {
          return (
            birdDict2 !== {} && (
              <article style={{ display: "flex", flexDirection: "column" }}>
                <img
                  alt={speciesKOR + "_image"}
                  height="120px"
                  width="150px"
                  src={
                    Object.values(birdDict2).filter(
                      (bird) => bird[2] === speciesKOR
                    )[0] &&
                    "http://" +
                      Object.values(birdDict2).filter(
                        (bird) => bird[2] === speciesKOR
                      )[0][5]
                  }
                  style={
                    myCollection
                      .map(
                        (species: any) =>
                          species.species < 536 && birdDict2[species.species]
                      )
                      .map((bird) => bird[2])
                      .includes(speciesKOR)
                      ? { filter: "none" }
                      : { filter: "grayscale(100%)" }
                  }
                />
                {/* {JSON.stringify(
                  myCollection
                    .map(
                      (species: any) =>
                        species.species < 536 && birdDict2[species.species]
                    )
                    .map((bird) => bird[2])
                )} */}
                {/* <i>
                  {JSON.stringify(
                    Object.values(birdDict2).filter(
                      (bird) => bird[2] === speciesKOR
                    )[0] &&
                      Object.values(birdDict2).filter(
                        (bird) => bird[2] === speciesKOR
                      )[0][5]
                  )}
                </i> */}
                <span>
                  <strong>{speciesKOR}</strong>
                </span>
              </article>
            )
          );
        })}
      </section>

      <div
        style={{
          width: "100%",
          height: "20px",
          borderBottom: "1px solid black",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            backgroundColor: "#F3F5F6",
            padding: "0 10px",
          }}
        >
          내가 만난 새들:{" "}
          {
            myCollection.filter((species: any) => {
              return birdDict2[species.species][4] < 536 ? true : false;
            }).length
          }{" "}
          종
        </span>
      </div>
      <section
        className="recent_met"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
      >
        {myCollection &&
          myCollection.map((species: any, index: number) => {
            // console.log("species", species);
            return (
              birdDict2[species.species][4] < 536 && (
                <article style={{ display: "flex", flexDirection: "column" }}>
                  <img
                    alt={birdDict2[species.species][2] + "_image"}
                    height="120px"
                    width="150px"
                    src={"http://" + birdDict2[species.species][5]} //"https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                  <span>
                    <strong>{birdDict2[species.species][2]}</strong>
                    <span style={{ float: "right" }}>{species.count}회</span>
                    {/* <p>{species.count}번 만났습니다.</p> */}
                  </span>
                </article>
              )
            );
          })}
        {/* <div style={{ height: "120px", width: "150px" }}></div>
        <div style={{ height: "120px", width: "150px" }}></div>
        <div style={{ height: "120px", width: "150px" }}></div> */}
        <i aria-hidden="true"></i>
        <i aria-hidden="true"></i>
        <i aria-hidden="true"></i>
        <i aria-hidden="true"></i>
      </section>
    </main>
  );
}

{
  /* <div>
{birdDict2[species.species][2]}, {species.count}
<img src={birdDict2[species.species][5]} alt="asdf" />
</div> */
}
