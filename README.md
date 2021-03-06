# 소셜독 프론트엔드
![KakaoTalk_Photo_2022-02-26-18-39-16 001 (1)](https://user-images.githubusercontent.com/61589338/177762295-fccfefd1-f17e-4c54-b9a9-12c6162b7228.png)   
지역기반의 반려동물 커뮤니티 소셜독의 프론트엔드입니다.  
React를 사용하였으며, 상태관리는 Apollo Client를 사용하였습니다.

## 기술 스택
 * Typescript
 * React
 * Apollo Client

## 기능 구현
 - 로그인 관련  
 JWT방식 Token사용.  
 Kakao Login Api사용.
 Apollo Client의 Error Handling을 활용하여 만료된 Token자동 갱신.

 - 사용자 관련    
 사용자 이름, 프로필 사진 변경 및 프로필 공개여부 설정.  
 다른 사용자를 구독하여 게시물을 볼 수 있음.  
 다른 사용자를 차단하여 내 프로필 및 게시물을 볼 수 없게하고, 차단한 사용자의 게시물도 볼 수 없게 할 수 있음.
 사용자의 이름을 검색하여 친구추가를 할 수 있음.
 프로필을 공개한 사람은 추천 친구로 보여줌.
  
 - 게시글 관련  
 본인이 작성한 게시물과 좋아요 누른 게시물을 프로필 화면에서 볼 수 있음.  
 게시물 작성 시, 태그하고 싶은 장소의 주소를 입력 할 수 있음.  
 사용자의 위치정보를 이용하여, 사용자 주변에서 작성된 게시물을 확인 할 수 있음.    
   
 - 신고 기능  
 게시글, 댓글 및 사용자 신고 가능.  

 - 클라이언트 사이드 캐싱
 게시물 및 유저정보 캐싱. 데이터 변경시 캐시 수정.