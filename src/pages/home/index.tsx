import React, { useState } from 'react';
import styled from 'styled-components';

const ROOM_DATA = [
  {
    id: 1,
    roomName: '1번방',
    room: [
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
    ],
  },
  {
    id: 2,
    roomName: '2번방',
    room: [
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
      { id: '', name: '' },
    ],
  },
];

const USER_DATA = [
  {
    id: 'uid1',
    name: 'kim',
    active: false,
  },
  {
    id: 'uid2',
    name: 'lee',
    active: false,
  },
];

const HomePage = () => {
  const [roomData, setRoomData] = useState(ROOM_DATA);
  const [userData, setUserData] = useState(USER_DATA);

  const switchingRoomData = (uId: string, tId: number, roomNumber: number, userName: string) => {
    console.log('roomNumber', roomNumber);
    console.log('tId', tId);
    const copyRoomData = Array.from(roomData);

    copyRoomData[tId - 1]?.room?.splice(roomNumber - 1, 1); // splice를 이용해 delete
    // delete copyRoomData[tId - 1]?.room[roomNumber - 1]; // 이렇게 제거 할 경우 희소배열이 생성된다. empty
    copyRoomData[tId - 1]?.room?.splice(roomNumber - 1, 0, { id: uId, name: userName }); // 제거된곳에 데이터 추가
    console.log(copyRoomData);
    setRoomData(copyRoomData);
  };

  const onDragStartUser = (event: any) => {
    event.dataTransfer.setData('userName', event.target.dataset.name);
    event.dataTransfer.setData('userId', event.target.dataset.userId);
  };

  const onDropRoom = (event: any) => {
    const userName = event.dataTransfer.getData('userName');
    const userId = event.dataTransfer.getData('userId');

    const { teamId, roomIndex } = event.target.dataset;
    console.log('first teamId', teamId);
    switchingRoomData(userId, teamId, roomIndex, userName);
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
              {room.map(({ name }, index) => (
                <RoomItem
                  key={index.toString()}
                  onDrop={onDropRoom}
                  onDragOver={onDragOver}
                  data-team-id={id}
                  data-room-index={index + 1}
                >
                  {name}
                </RoomItem>
              ))}
            </RoomBox>
          </Box>
        ))}
      </VStack>

      <UserBox>
        {userData.map(({ id, name }) => (
          <UserText
            key={id}
            onDragStart={onDragStartUser}
            draggable
            onDragOver={onDragOver}
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
