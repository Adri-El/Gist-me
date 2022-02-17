export const getGistMateName = (chatConfig, selectedChat) => {
    const firstName = selectedChat.people.find(gistMate=> gistMate.person.username !== chatConfig.userName)?.person?.first_name;
    const lastName = selectedChat.people.find(gistMate=> gistMate.person.username !== chatConfig.userName)?.person?.last_name;
    return `${firstName} ${lastName}`
}

