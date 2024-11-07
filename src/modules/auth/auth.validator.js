const yup = require("yup");
exports.registerValidationSchema = yup.object({
  email: yup
    .string()
    .min(3, "email must be 3 char")
    .max(100, "email must be 100 char")
    .email("please enter valid email")
    .required("Please enter email"),
  username: yup
    .string()
    .min(3, "username minimum is 3")
    .max(100, " username maximum is 100")
    .required("please enter username"),

  name: yup
    .string()
    .min(3, "name minimum is 3")
    .max(100, "maximum is 100")
    .required("Please enter name"),
  password: yup
    .string()
    .min(8, "password minimum is 8")
    .max(36, "password maximum is 36")
    .required("Please enter password"),
});
