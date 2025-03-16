function mapFieldsToInsert(data) {
  return Object.entries(data).filter(([_, value]) => value !== undefined).map(([key, value]) => ({ column: snakeCase(key), value }));
}

console.log(mapFieldsToInsert({
  originalUrl: "/hey",
  code: "bpy"
}))
