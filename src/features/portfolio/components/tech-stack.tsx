import Image from "next/image"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"

import { TECH_STACK } from "../data/tech-stack"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function TechStack() {
  const iconClassName = "h-full w-full object-contain"

  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle>Stack</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <ul className="flex flex-wrap gap-4 select-none">
          {TECH_STACK.map((tech) => {
            return (
              <li key={tech.key} className="flex">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <a
                        href={tech.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={tech.title}
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center">
                          {tech.theme ? (
                            <>
                              <Image
                                src={`/tech-stack-icons/${tech.key}-light.svg`}
                                alt={`${tech.title} light icon`}
                                width={32}
                                height={32}
                                className={`${iconClassName} hidden [html.light_&]:block`}
                                unoptimized
                              />
                              <Image
                                src={`/tech-stack-icons/${tech.key}-dark.svg`}
                                alt={`${tech.title} dark icon`}
                                width={32}
                                height={32}
                                className={`${iconClassName} hidden [html.dark_&]:block`}
                                unoptimized
                              />
                            </>
                          ) : (
                            <Image
                              src={`/tech-stack-icons/${tech.key}.svg`}
                              alt={`${tech.title} icon`}
                              width={32}
                              height={32}
                              className={iconClassName}
                              unoptimized
                            />
                          )}
                        </span>
                      </a>
                    }
                  />
                  <TooltipContent>
                    <p>{tech.title}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </PanelContent>
    </Panel>
  )
}
