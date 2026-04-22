import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get("title")

  const robotoCondensedMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/RobotoCondensed-Medium.ttf")
  )

  return new ImageResponse(
    <div tw="w-full h-full flex items-center justify-center text-white bg-black p-16">
      <div tw="absolute flex inset-y-0 w-px border border-zinc-800 left-16" />
      <div tw="absolute flex inset-y-0 w-px border border-zinc-800 right-16" />
      <div tw="absolute flex inset-x-0 h-px border border-zinc-800 top-16" />
      <div tw="absolute flex inset-x-0 h-px border border-zinc-800 bottom-16" />

      <div tw="absolute flex bottom-16 right-16">
        <svg
          width={176}
          height={80}
          viewBox="0 0 352 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0h32v160H0ZM32 0h64v96H32V64h32V32H32ZM64 96h32v64H64ZM128 0h96v64h-32v32h32v64h-96v-32h64V96h-64V64h64V32h-64ZM256 0h32v160h-32ZM288 0h64v64h-32v32h32v64h-64v-32h32V96h-32V64h32V32h-32Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <h1
        tw="text-center font-medium"
        style={{
          fontFamily: "RobotoCondensed",
          fontSize: 64,
        }}
      >
        {title}
      </h1>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "RobotoCondensed",
          data: robotoCondensedMedium,
          weight: 500,
        },
      ],
    }
  )
}
