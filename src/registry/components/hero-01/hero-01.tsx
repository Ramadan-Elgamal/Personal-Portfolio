import type { ComponentProps } from "react"

export type Hero01Props = ComponentProps<"section"> & {
  brand?: string
  title?: string
  description?: string
  price?: string
  imageSrc?: string
  imageAlt?: string
  reviewCount?: number
  rating?: number
}

const DEFAULT_DESCRIPTION =
  "Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan."

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="h-4 w-4 text-red-400"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

export function Hero01({
  brand = "BRAND NAME",
  title = "The Catcher in the Rye",
  description = DEFAULT_DESCRIPTION,
  price = "$58.00",
  imageSrc = "https://dummyimage.com/400x400",
  imageAlt = "Product image",
  reviewCount = 4,
  rating = 4,
  className,
  ...props
}: Hero01Props) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)))
  const reviewLabel = `${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`

  return (
    <section
      className={`body-font overflow-hidden bg-gray-900 text-gray-400${className ? ` ${className}` : ""}`}
      {...props}
    >
      <div className="container mx-auto px-5 py-24">
        <div className="mx-auto flex flex-wrap lg:w-4/5">
          <img
            alt={imageAlt}
            className="h-64 w-full rounded object-cover object-center lg:h-auto lg:w-1/2"
            src={imageSrc}
          />

          <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
            <h2 className="title-font text-sm tracking-widest text-gray-500">
              {brand}
            </h2>

            <h1 className="title-font mb-1 text-3xl font-medium text-white">
              {title}
            </h1>

            <div className="mb-4 flex">
              <span className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} filled={index < normalizedRating} />
                ))}

                <span className="ml-3">{reviewLabel}</span>
              </span>

              <span className="ml-3 flex space-x-2 border-l-2 border-gray-800 py-2 pl-3 text-gray-500">
                <button
                  type="button"
                  aria-label="Share on Facebook"
                  className="cursor-pointer"
                >
                  <FacebookIcon />
                </button>

                <button
                  type="button"
                  aria-label="Share on Twitter"
                  className="cursor-pointer"
                >
                  <TwitterIcon />
                </button>

                <button
                  type="button"
                  aria-label="Share by message"
                  className="cursor-pointer"
                >
                  <ChatIcon />
                </button>
              </span>
            </div>

            <p className="leading-relaxed">{description}</p>

            <div className="mt-6 mb-5 flex items-center border-b-2 border-gray-800 pb-5">
              <div className="flex">
                <span className="mr-3">Color</span>

                <button
                  type="button"
                  aria-label="Select color white"
                  className="h-6 w-6 rounded-full border-2 border-gray-800 focus:outline-none"
                />

                <button
                  type="button"
                  aria-label="Select color gray"
                  className="ml-1 h-6 w-6 rounded-full border-2 border-gray-800 bg-gray-700 focus:outline-none"
                />

                <button
                  type="button"
                  aria-label="Select color red"
                  className="ml-1 h-6 w-6 rounded-full border-2 border-gray-800 bg-red-500 focus:outline-none"
                />
              </div>

              <div className="ml-6 flex items-center">
                <span className="mr-3">Size</span>

                <div className="relative">
                  <select className="appearance-none rounded border border-gray-700 bg-transparent py-2 pr-10 pl-3 text-white focus:border-red-500 focus:ring-2 focus:ring-red-900 focus:outline-none">
                    <option>SM</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>

                  <span className="pointer-events-none absolute top-0 right-0 flex h-full w-10 items-center justify-center text-gray-600">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex">
              <span className="title-font text-2xl font-medium text-white">
                {price}
              </span>

              <button
                type="button"
                className="ml-auto flex rounded border-0 bg-red-500 px-6 py-2 text-white hover:bg-red-600 focus:outline-none"
              >
                Button
              </button>

              <button
                type="button"
                aria-label="Add to wishlist"
                className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-800 p-0 text-gray-500"
              >
                <HeartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
