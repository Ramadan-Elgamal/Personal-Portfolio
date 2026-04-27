import Image from "next/image"

export function MainLogo(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={`relative flex aspect-[352/160] items-center justify-center overflow-hidden ${props.className || ""}`}
    >
      <Image
        src="/logo-dark.svg"
        alt="RRR Logo"
        fill
        className="object-contain dark:hidden"
        priority
      />
      <Image
        src="/logo-light.svg"
        alt="RRR Logo"
        fill
        className="hidden object-contain dark:block"
        priority
      />
    </div>
  )
}
