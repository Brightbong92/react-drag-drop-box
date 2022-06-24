import React, { useState } from 'react';
import { ROOM_DATA, USER_DATA } from '@utils/data';

const useDnd = () => {
  const [roomData, setRoomData] = useState(ROOM_DATA);
  const [userData, setUserData] = useState(USER_DATA);

  /*
    nowDragingIndex // 현재 드래그 중인 방의 index
    roomNumber // 이동하려는 방의 index
    beforeNowDragingIndex, // 드래그 한거 인덱스
   */

  const switchingRoomData = (
    type: 'room' | 'user',
    uId: string,
    tId: number, // 이동하려는 팀번호
    roomNumber: number,
    userName: string,
    beforeTeamId: number, // 이동하기전 팀번호
  ) => {
    const copyRoomData = Array.from(roomData);
    const copyUserData = Array.from(userData);

    if (type === 'user') {
      if (copyRoomData[tId - 1].room[roomNumber].uId) return alert('이미 방에 인원이 존재합니다.');

      copyRoomData[tId - 1]?.room?.splice(roomNumber, 1); // splice를 이용해 delete // delete copyRoomData[tId - 1]?.room[roomNumber - 1]; // 이렇게 제거 할 경우 희소배열이 생성된다. ex) [empty, empty...]
      copyRoomData[tId - 1]?.room?.splice(roomNumber, 0, { tId: tId - 0, uId, userName }); // 제거된곳에 데이터 추가

      const filteredUserData = copyUserData.filter((v) => v.id !== uId);
      setUserData(filteredUserData);
      setRoomData(copyRoomData);
    } else if (type === 'room') {
      let nowDragingIndex = copyRoomData[tId - 1]?.room.findIndex((v) => v.uId === uId);

      if (copyRoomData[tId - 1].room[roomNumber].uId !== '') {
        // 방에 데이터가 존재한다면 서로 스위칭
        if (beforeTeamId === tId) {
          const temp = copyRoomData[tId - 1].room[roomNumber];
          copyRoomData[tId - 1].room[nowDragingIndex] = temp;
          copyRoomData[tId - 1].room[roomNumber] = { tId: tId - 0, uId, userName };
          setRoomData(copyRoomData);
        } else {
          const beforeNowDragingIndex = copyRoomData[beforeTeamId - 1]?.room.findIndex((v) => v.uId === uId);
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

  const onDragStartRoom = (event: any, uId: string, userName: string, tId: number, roomIndex: number) => {
    if (uId && userName) {
      event.dataTransfer.setData('type', event.target.dataset.type);
      event.dataTransfer.setData('userName', userName);
      event.dataTransfer.setData('userId', uId);
      event.dataTransfer.setData('beforeTeamId', tId);
      event.dataTransfer.setData('roomIndex', roomIndex);
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

  const switchingUserData = (userName: string, uId: string, beforeTId: number, roomNumber: number) => {
    const copyRoomData = Array.from(roomData);
    const copyUserData = Array.from(userData);

    copyRoomData[beforeTId - 1].room.splice(roomNumber, 1, { tId: 0, uId: '', userName: '' });
    copyUserData.push({ id: uId, name: userName });

    setRoomData(copyRoomData);
    setUserData(copyUserData);
  };

  const onDropUserBox = (event: any) => {
    const userName = event.dataTransfer.getData('userName');
    const userId = event.dataTransfer.getData('userId');
    const beforeTeamId = event.dataTransfer.getData('beforeTeamId');
    const roomIndex = event.dataTransfer.getData('roomIndex');

    // user를 드래그할때는 roomIndex가 없기에 아래 함수 호출이 안되게됨
    if (roomIndex) switchingUserData(userName, userId, beforeTeamId, roomIndex);
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onClickInit = () => {
    const copyOriginRoomData = Array.from(ROOM_DATA);
    console.log('roomData', roomData);
    console.log('copyOriginRoomData', copyOriginRoomData);
    // setRoomData(ROOM_DATA);
    // setUserData(USER_DATA);
  };

  return {
    roomData,
    userData,
    switchingRoomData,
    switchingUserData,
    onDragStartUser,
    onDragStartRoom,
    onDropRoom,
    onDropUserBox,
    onDragOver,
    onClickInit,
  };
};

export default useDnd;
