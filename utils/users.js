const users = [];

// join user to chat
exports.userJoin = (id, username) => {
  username = username.trim().toLocaleLowerCase();
  const existingUser = users.find((user) => {
    return user.username === username;
  });

  // validate username
  if (existingUser) {
    return {
      user: false,
      error: "Username already in use",
    };
  }
  const user = { id, username };
  users.push(user);
  return { user, error: false };
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
