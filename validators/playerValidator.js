const { check, validationResult } = require("express-validator");
const { escape } = require("mysql2");

const validatePlayer = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .escape()
    .withMessage("Cannot leave this empty!"),

  check("jersey")
    .trim()
    .not()
    .isEmpty()
    .isInt({ min: 0, max: 99 })
    .escape()
    .withMessage("Cannot have number less then 0 and bigger then 100!"),

  check("position")
    .trim()
    .not()
    .isEmpty()
    .escape()
    .withMessage("Cannot leave this empty!"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = {
  validatePlayer,
};
