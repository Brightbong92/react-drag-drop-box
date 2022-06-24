import React from 'react';
import styled from 'styled-components';

import useDnd from '@hooks/useDnd';

const HomePage = () => {
  const { roomData, userData, onDragOver, onDragStartRoom, onDragStartUser, onDropRoom, onDropUserBox, onClickInit } =
    useDnd();

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
                  onDragStart={(e) => onDragStartRoom(e, uId, userName, tId, index)}
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

        <InitButton type="button" onClick={onClickInit}>
          초기화
        </InitButton>
      </VStack>

      <UserBox onDrop={onDropUserBox} onDragOver={onDragOver}>
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

const InitButton = styled.button`
  width: 60px;
  height: 30px;
  margin-bottom: 20px;
`;

export default HomePage;
