import { MainLogo } from "./main-logo"

export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return <MainLogo {...props} />
}

export function getMarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 352 160"><path fill="${color}" d="M0 0h32v160H0ZM32 0h64v96H32V64h32V32H32ZM64 96h32v64H64ZM128 0h96v64h-32v32h32v64h-96v-32h64V96h-64V64h64V32h-64ZM256 0h32v160h-32ZM288 0h64v64h-32v32h32v64h-64v-32h32V96h-32V64h32V32h-32Z"/></svg>`
}
