<img src="https://user-images.githubusercontent.com/53146455/108034066-4b800680-7078-11eb-9e02-45f4d2ed74b0.gif" width="600"/>

[Full Demo Video](https://www.youtube.com/watch?v=2DdVlVzcMXc)

[Demo on Web](https://dearname.app)



# 프로젝트 소개

**내가 만난 동식물을 기록하고 공유할 수 있다면 어떨까?** 라는 생각으로 시작된 프로젝트입니다. 생물 (현재 조류만 지원)의 사진을 담은 포스팅을 작성 하면 팔로워들이 게시물을 볼 수 있습니다. **사진을 업로드 하면 자동으로 AI 모델이 어떤 생물종인지 알려 줍니다.**

실사용을 고려하기 보다는 서버개발자로 지원하기위한 **포트폴리오를 목표로 제작**하였습니다. 현재 회원탈퇴, 프로필 수정등의 기능은 구현되어있지 않았습니다. 특히 프론트엔드 부분은 여러모로 (상태관리, 라우팅 등) 어설프게 제작한 부분이 많습니다.

이진석 님의 [리액트와 함께 장고 시작하기](https://educast.com/course/web-dev/ZU53) 강의를 수강하고 강의 내용을 기반하여 프로젝트를 진행했음을 밝힙니다.



# Backend 

### **Main API Server** 

* **Django Rest Framework** (DRF)의 `GenericAPIView`를 이용했습니다.
* 주요 기능 아래와 같습니다
  * 회원가입 및 로그인
  * 게시물 작성
  * 좋아요, 댓글
  * 피드 및 친구 추천. (단순 최근 게시물 및 회원목록 제공. 추천 알고리즘 X)
  * 내 게시물 (보기, 삭제), 내가 본 생물(my collection) 목록
  * FE에 사용되는 Bird_dict 데이터  API
* 유저 모델은 강의 내용과 마찬가지로 django.contrib에서 제공하는 AbstractUser 모델을 기반 합니다.
* 기타 모델은 Post, Tag, Comment, Photo, Species 가 있으며 Tag와 Comment는 강의에서 제공된 코드를 이용했습니다.



### **Predict API Server** 

* **tensorflow.keras**에서 제공하는 EfficientNetB5 모델을 사용했고, 개인 GPU(RTX 2070S)로 학습시켰습니다.

* 데이터 셋으로는 **selenium**을 이용해 웹에서 스크래핑한 이미지 + coco dataset의 이미지를 이용하였습니다.
* 학습한 모델(.h5)은 **FastAPI**를 이용해 별도의 컨테이너에서 서빙하도록 했습니다.



### **Infra & Etc**

**AWS**와 **Docker**를 이용해 배포를 진행해 보았습니다.

* Computing: AWS **EC2** on **Ubuntu** 20.04
* Database: AWS **RDS-PostgreSQL**
* Storage: AWS **S3**
* CDN for API: AWS **CloundFront**
* Reverse Proxy: **NginX**
* Container Management: **Docker-Compose** 
* FE Static Files Serving: **Netlify**



# Frontend

* **React Hook**과 **AntDesign**에서 제공하는 컴포넌트를 이용해 개발했습니다.

* Carousel에는 **React Slick**을 사용했습니다.
* 프론트 단에서 사진 편집기능을 제공하기 위해 **AntD-Img-Crop** 라이브러리를 이용했습니다.
* 프론트 단에서 이미지 메타정보를 넘겨주는 것이 좋겠다고 생각되어 **EXIF-js** 라이브러리를 이용했습니다. 사진 촬영정보(셔터속도, 조리개 f값, 렌즈 촛점거리 등) 및 GPS정보 등을 가져올 수 있습니다.
* 로그인 인증 방식은 **jwt 토큰**을 로컬스토리지에 저장하여 이용합니다. **ContextAPI**를 통해 로그인여부를 판단하고 토큰이 없을 경우 LoginURL로 이동시킵니다. 로그인과 관련한 부분은 강의에서 제공된 내용을 이용했습니다.





# 회고 ~~반성문~~

개발 총 기간을 한달 반으로 잡고 시작했고, 최소한의 기능만 구현한채 deploy까지 하는 것을목표로 했었습니다. 하지만 배포관련 부분의 미숙함으로 인해 디버깅에 많은 시간을 허비했고 우선순위에 밀린 많은 기능들은 구현하지 못한채 프로젝트를 끝맺어야 했습니다. 개발 과정에서 수많은 아쉬움들이 있었지만 현 시점에서 기억나는 것들 위주로 짚어보고자 합니다.

### Backend

백엔드에 남은 주요 아쉬움은 아래와 같습니다.

* 제한적인 기능 구현

  * API는 펑펑 찍어내면 되지만 프론트엔드까지 혼자 개발해야 한다는 압박에 API 자체도 일부만 구현하고 말았습니다.
  * **회원정보 수정**, **비밀번호 찾기** 등은 틈틈이 구현해 반영할 계획입니다.
  * 친구**추천** 기능이나 **대댓글** 기능, **채팅**기능 등 또한 매우 중요한 요소라고 생각하며 리팩토링시 반영해보고 싶습니다.

* API 문서화 X

  * swagger등으로 API를 문서화 할 수 있지만 일단 프로젝트에 반영하지 않고 마무리 했습니다.
  * FastAPI의 경우 비동기처리 뿐만 아니라 스웨거 문서를 자동 생성하는 기능도 있기 때문에 FastAPI를 이용해 백엔드를 재구축 한다면 별도의 문서화 작업은 필요 없을 것으로 생각됩니다.

  

### Frontend

마음속에 정해둔 개발 기한을 넘기다 보니 갈수록 프론트엔드를 대충 만들게 되었습니다. 아래와 같은 점들이 주요 문제점들이며, 기한을 ~~매우~~ 넉넉하게 두고 리팩토링하고자 합니다. 

* 안 쓴것만 못한 Typescript
  * "타입스크립트를 써보자" 라는 생각으로 타입스크립트 프로젝트로 시작을 했으나 결국 `any` 만 사용하게 되었습니다.
* 엉망진창 CSS
  * `.scss`에 작성한 것과 컴포넌트에 `style` 프로퍼티로 작성한 것이 뒤죽박죽 섞여있습니다.모바일을 염두에두고 interactive하게 구성 했어야 하는데 고정 픽셀을 남용하는 바람에 모바일에서 포스트가 잘려 나오는 상황입니다.
* 여러 이미지 동시 업로드 기능과 이미지 편집기능을 함께 구현하지 못했습니다.
  * Ant Design의 컴포넌트에 의존하다 보니 커스터마이징의 한계가 있었습니다.
* 무한스크롤 기반 pagination을 구현하려다 말았습니다.
  * 어리석게도 이 모든걸 계획한 시간내에 다 구현할 수 있을 줄 알았으나 큰 오산이었습니다..



### Etc

깃허브 프로젝트 기능을 이용해 프로젝트를 관리해볼 생각도 있었으나 끝내 제대로 사용해보지 않았습니다. 어느정도 프로젝트의 윤곽이 잡혔으니 이후의 개발 이슈들을 칸반 형식으로 관리해 보는 것도 좋지 않을까 생각합니다.   

