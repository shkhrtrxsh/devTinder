const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateEditProfileData = (req) => {
  try {
    const { firstName, lastName, photoUrl, about, skills } = req.body;
    if (!firstName || !lastName || !photoUrl || !about || !skills) {
      throw new Error("Invalid Edit Request");
    } else if (!validator.isURL(photoUrl)) {
      throw new Error("Invalid photo URL");
    } else if (!validator.isLength(about, { min: 10, max: 1000 })) {
      throw new Error("About must be between 10 and 1000 characters");
    } else if (!Array.isArray(skills) || skills.length === 0) {
      throw new Error("Skills must be an array and not empty");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const validatePassword = (req) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new Error("All fields are required");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validatePassword,
};
