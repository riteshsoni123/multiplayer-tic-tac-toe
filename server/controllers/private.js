const User = require("../models/User");

exports.getPrivateData = async (req, res, next) => {
  const user = req.user;
  res.status(200).send(user);
};

exports.updatedata = async (req, res, next) => {
  const user = req.user;

  if (req.body.won) {
    user.won += 1;
  } else if (req.body.lost) {
    user.lost += 1;
  } else {
    user.drawn += 1;
  }

  User.findByIdAndUpdate(
    req.params.id,
    { won: user.won, lost: user.lost, drawn: user.drawn },
    (err, docs) => {
      if (!err) {
        res.status(200).send(user);
      } else {
        res
          .status(500)
          .json({ success: false, message: "Can't update the item" });
      }
    }
  );
};
