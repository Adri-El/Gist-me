export const getRoomMateUsername = (roomMates, currentUserUsername)=>{
    return '@' + roomMates
        .map(roomMate => roomMate.person.username)
        .filter(username=> username !== currentUserUsername).join(', @')
}

