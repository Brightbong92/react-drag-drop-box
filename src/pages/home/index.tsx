import React, { useState } from 'react';
import styled from 'styled-components';
import { ROOM_DATA, USER_DATA } from '@utils/data';

const HomePage = () => {
  const [roomData, setRoomData] = useState(ROOM_DATA);
  const [userData, setUserData] = useState(USER_DATA);

  /*
    nowDragingIndex // 내가 현재 드래그 중인 방의 index
    roomNumber // 내가 이동하려는 방의 index
   */

  const switchingRoomData = (
    type: 'room' | 'user',
    uId: string,
    tId: number,
    roomNumber: number,
    userName: string,
    beforeTeamId: number,
  ) => {
    const copyRoomData = Array.from(roomData);
    const copyUserData = Array.from(userData);

    if (type === 'user') {
      if (copyRoomData[tId - 1].room[roomNumber].uId) return alert('이미 방에 인원이 존재합니다.');

      copyRoomData[tId - 1]?.room?.splice(roomNumber, 1); // splice를 이용해 delete // delete copyRoomData[tId - 1]?.room[roomNumber - 1]; // 이렇게 제거 할 경우 희소배열이 생성된다. ex) [empty, empty...]
      copyRoomData[tId - 1]?.room?.splice(roomNumber, 0, { tId: tId - 0, uId, userName }); // 제거된곳에 데이터 추가

      const filteredUserData = copyUserData.filter((v) => v.id !== uId);
      setUserData(filteredUserData);
      console.log(copyRoomData);
      setRoomData(copyRoomData);
    } else if (type === 'room') {
      let nowDragingIndex = copyRoomData[tId - 1]?.room.findIndex((v) => v.uId === uId);

      if (copyRoomData[tId - 1].room[roomNumber].uId !== '') {
        // 방에 데이터가 존재한다면 서로 스위칭

        if (beforeTeamId === tId) {
          const temp = copyRoomData[tId - 1].room[roomNumber];
          copyRoomData[tId - 1].room[nowDragingIndex] = temp;
          copyRoomData[tId - 1].room[roomNumber] = { tId: tId - 0, uId, userName };
          console.log(copyRoomData);
          setRoomData(copyRoomData);
        } else {
          const beforeNowDragingIndex = copyRoomData[beforeTeamId - 1]?.room.findIndex(
            (v) => v.uId === uId,
          );
          // console.log(
          //   'roomNumber',
          //   roomNumber, // 드롭되는 인덱스
          //   'tId',
          //   tId, // 들어가야하는 방번호
          //   'beforeTId',
          //   beforeTeamId, // 들어가기전 방번호
          //   'beforeNowDragingIndex',
          //   beforeNowDragingIndex, // 드래그 한거 인덱스
          // );
          const temp = copyRoomData[tId - 1].room[roomNumber];
          temp.tId = beforeTeamId - 0;
          copyRoomData[beforeTeamId - 1].room[beforeNowDragingIndex] = temp;
          copyRoomData[tId - 1].room[roomNumber] = { tId: tId - 0, uId, userName };
          setRoomData(copyRoomData);
        }
      } else {
        // 빈방으로 드롭 할 경우
        // copyRoomData[tId - 1]?.room?.splice(nowDragingIndex, 1); // 현재 드래그 중인 방 제거
        // 주소를 같이 사용해서 이게 제거되면 이전꺼가 앞으로 밀리기에 빈 데이터를 추가하여 해결
        if (beforeTeamId === tId) {
          // 같은방에서 이동 할 경우
          copyRoomData[tId - 1]?.room?.splice(roomNumber, 1, { tId: tId - 0, uId, userName }); // 드롭한 방에 드래그 중인 데이터 추가
          copyRoomData[tId - 1]?.room?.splice(nowDragingIndex, 1, {
            tId: 0,
            uId: '',
            userName: '',
          }); // 현재 드래그 했던 방에 빈 데이터 추가
          setRoomData(copyRoomData);
        } else {
          // 다른방으로 이동 할 경우
          nowDragingIndex = copyRoomData[beforeTeamId - 1]?.room.findIndex((v) => v.uId === uId);
          if (nowDragingIndex === -1) return;
          copyRoomData[beforeTeamId - 1]?.room?.splice(nowDragingIndex, 1, {
            tId: 0,
            uId: '',
            userName: '',
          }); // 현재 방 드래그한 객체 빈 데이터 추가
          copyRoomData[tId - 1]?.room?.splice(roomNumber, 1, { tId: tId - 0, uId, userName });
          setRoomData(copyRoomData);
        }
      }
    }
  };

  const onDragStartUser = (event: any) => {
    event.dataTransfer.setData('type', event.target.dataset.type);
    event.dataTransfer.setData('userName', event.target.dataset.name);
    event.dataTransfer.setData('userId', event.target.dataset.userId);
  };

  const onDragStartRoom = (event: any, uId: string, userName: string, tId: number) => {
    if (uId && userName) {
      event.dataTransfer.setData('type', event.target.dataset.type);
      event.dataTransfer.setData('userName', userName);
      event.dataTransfer.setData('userId', uId);
      event.dataTransfer.setData('beforeTeamId', tId);
    }
  };

  const onDropRoom = (event: any) => {
    const type = event.dataTransfer.getData('type');
    const userName = event.dataTransfer.getData('userName');
    const userId = event.dataTransfer.getData('userId');
    const beforeTeamId = event.dataTransfer.getData('beforeTeamId');

    const { teamId, roomIndex } = event.target.dataset;

    switchingRoomData(type, userId, teamId, roomIndex, userName, beforeTeamId);
  };

  const onDropUserBox = (event: any) => {
    const type = event.dataTransfer.getData('type');
    const userName = event.dataTransfer.getData('userName');
    const userId = event.dataTransfer.getData('userId');
    const beforeTeamId = event.dataTransfer.getData('beforeTeamId');

    console.log(type, userName, userId, beforeTeamId);
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Container>
      <VStack>
        {roomData.map(({ id, roomName, room }, index) => (
          <Box key={id + index.toString()}>
            <TeamTitle>{roomName}</TeamTitle>
            <RoomBox>
              {room.map(({ tId, uId, userName }, index) => (
                <RoomItem
                  key={index.toString()}
                  onDrop={onDropRoom}
                  onDragStart={(e) => onDragStartRoom(e, uId, userName, tId)}
                  onDragOver={onDragOver}
                  draggable
                  data-type="room"
                  data-team-id={id}
                  data-room-index={index}
                >
                  {userName}
                </RoomItem>
              ))}
            </RoomBox>
          </Box>
        ))}
      </VStack>

      <UserBox onDrop={onDropUserBox}>
        {userData.map(({ id, name }) => (
          <UserText
            key={id}
            onDragStart={onDragStartUser}
            draggable
            onDragOver={onDragOver}
            data-type="user"
            data-user-id={id}
            data-name={name}
          >
            {name}
          </UserText>
        ))}
      </UserBox>
    </Container>
  );
};

const VStack = styled.div`
  display: flex;
  flex-direction: column;

  & div:nth-child(n) {
    margin-bottom: 10px;
  }
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  min-height: 100px;
  height: auto;
  background-color: #f8d8d8;

  & span:nth-child(n) {
    margin-bottom: 10px;
  }
`;

const UserText = styled.span`
  width: 30px;
  height: 30px;
  background-color: #000;
  color: #fff;
`;

const Container = styled.div`
  padding-top: 20px;
  margin: 0 auto;
  width: 720px;
`;

const Box = styled.div`
  display: flex;
`;

const TeamTitle = styled.span`
  width: 100px;
  height: 100px;
  background-color: pink;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const RoomBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  height: auto;
  background-color: #f6f6f6;
  padding: 20px;

  & :nth-child(n) {
    margin-right: 20px;
    margin-bottom: 20px;
  }
`;

const RoomItem = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f9f8;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default HomePage;
