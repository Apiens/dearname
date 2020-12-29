export function parseErrorMessages(fieldErrorMessages: any) {
  return Object.entries(fieldErrorMessages).reduce(
    (acc: any, [fieldName, errors]: any) => {
      acc[fieldName] = {
        validateStatus: "error",
        help: errors.join(" "), //errors: ["message1", "message2", ...]
      };
      return acc;
    },
    {}
  );
}
