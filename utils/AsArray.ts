export function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function asString(value: string | string[] | undefined): string {
  if (!value) return "";
  if (Array.isArray(value)) {
    if (value.length === 1) {
      return value[0];
    }
    return "Too many arguments in the array";
  }
  return value;
}
