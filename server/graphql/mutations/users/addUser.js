const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');

const User = mongoose.model('User');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    user: {
      name: 'user',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args, ctx) {
    const { username, password } = args.user;

    const newUser = new User(args.user);
    newUser.password = await newUser.generateHash(password);

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Could not save the User');

    return savedUser;
  },
};
