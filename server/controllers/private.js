exports.getPrivateData = async (req, res, next) => {
  const user = req.user;
  res.status(200).send(user);
};
