
export const getRoomMatesNames = (roomMates, currentUser)=>{
    return roomMates
        .filter(roomMate=> roomMate.person.username !== currentUser.userName)
        .map(roomMate=> roomMate.person.first_name).join(', ').slice(0, 33) + '...'
}