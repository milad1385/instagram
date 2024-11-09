const yup = require("yup");
exports.createNewPostSchema = yup.object({
  description: yup
    .string()
    .min(5, "min length is 5")
    .max(10000, "max length is 10000"),
});
