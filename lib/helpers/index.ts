export const isPathRelative = (path: string) =>  {
  // если у нас пути вот такого плана, то мы считаем, что наш путь относительный
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

