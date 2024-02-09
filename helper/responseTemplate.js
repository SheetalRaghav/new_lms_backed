const mongooseErrorSaveErrors = async (err) => {
  err.keyValue;
  key = Object.keys(err.keyValue)[0];
  return [
    {
      message: `${key} is already taken`,
      context: { key, value: err.keyValue[key] },
    },
  ];
};

const validationError = async (err) => {
  const keys = Object.keys(err.errors);
  const elem = keys[0];
  return keys.map((elem) => {
    let { kind, value } = err.errors[elem];
    if (kind == "unique") {
      return {
        message: `${elem} is already taken`,
        context: { key: elem, value },
      };
    }

    if (kind == "enum") {
      return {
        message: `${value} is not allowed value`,
        context: { key: elem, value },
      };
    }

    if (kind == "required") {
      if (!value) value = err.errors[elem].path;

      return { message: `${value} is required`, context: { key: elem, value } };
    }
  });
};

const successResponse = async (message, data) => {
  return { message, data };
};

module.exports = {
  mongooseErrorSaveErrors,
  validationError,
  successResponse,
};
