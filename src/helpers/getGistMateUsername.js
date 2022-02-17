
const getGistMateUsername = (chatConfig, selectedChat) => {
    return selectedChat.people.find(gistMate=> gistMate.person.username !== chatConfig.userName)?.person?.username;
}

export default getGistMateUsername;