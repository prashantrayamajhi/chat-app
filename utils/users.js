const users = [];

// join user to chat
exports.userJoin = (id, username) => {
  username = username.trim().toLocaleLowerCase();
  const user = { id, username };
  users.push(user);
  return user;
};

// get the current user
exports.getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// user leaves the chat
exports.userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
