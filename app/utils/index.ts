export function isObjectEmpty(obj: any) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function validateString(value: string) {
  if (typeof value !== "string") return `Invalid type: ${typeof value}`;
  else if (!value?.length) return "Required";
}

export function validateOption<T = string>(
  value: T,
  validOptions: readonly T[]
) {
  if (typeof value !== "string") return `Invalid type: ${typeof value}`;
  else if (!validOptions.includes(value)) return `Invalid option: ${value}`;
}
