import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const domain = searchParams.get("domain")
  const isForSale = searchParams.get("sale") === "true"

  const magistralMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/Magistral-Medium.ttf")
  )

  const robotoMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/Roboto-Medium.ttf")
  )

  return new ImageResponse(
    <div tw="flex text-black bg-white w-full h-full p-16">
      <div tw="flex-1 flex flex-col justify-center border-l border-r border-zinc-200">
        <div tw="flex justify-center border-t border-b border-zinc-200">
          <h1
            tw="mt-8 mb-4 ml-8 mr-8 font-medium"
            style={{
              fontFamily: "Magistral",
              fontSize: 88,
            }}
          >
            {domain}
          </h1>
        </div>

        <div tw="flex justify-center border-b border-zinc-200">
          <p
            tw="mt-0 mb-0 pt-4 pb-4 pl-8 pr-8 font-medium"
            style={{
              fontFamily: "Roboto",
              fontSize: 32,
              color: isForSale ? "#22c55e" : "#71717a",
            }}
          >
            {isForSale
              ? "The domain name is for sale"
              : "The website will be launched soon"}
          </p>
        </div>
      </div>

      <div tw="absolute flex inset-y-0 w-px bg-zinc-200 left-16" />
      <div tw="absolute flex inset-y-0 w-px bg-zinc-200 right-16" />
      <div tw="absolute flex inset-x-0 h-px bg-zinc-200 top-16" />
      <div tw="absolute flex inset-x-0 h-px bg-zinc-200 bottom-16" />

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
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Magistral",
          data: magistralMedium,
          weight: 500,
        },
        {
          name: "Roboto",
          data: robotoMedium,
          weight: 500,
        },
      ],
    }
  )
}
