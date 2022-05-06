module.exports = {
  servers: [
    {
      // TODO check if this works on prod
      url: `http://localhost:${process.env.PORT || 5000}`, // url
      description: "Local server", // name
    },
  ],
};
