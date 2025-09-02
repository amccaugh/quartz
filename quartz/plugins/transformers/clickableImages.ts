import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root } from "hast"
import isAbsoluteUrl from "is-absolute-url"

interface Options {
  /** Whether to make images clickable */
  enableClickableImages: boolean
  /** Whether to open full-size images in a new tab */
  openInNewTab: boolean
}

const defaultOptions: Options = {
  enableClickableImages: true,
  openInNewTab: true,
}

export const ClickableImages: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  return {
    name: "ClickableImages",
    htmlPlugins() {
      if (!opts.enableClickableImages) {
        return []
      }

      return [
        () => {
          return (tree: Root, file) => {
            visit(tree, "element", (node, index, parent) => {
              // Only process img elements
              if (node.tagName === "img" && node.properties && typeof node.properties.src === "string") {
                const src = node.properties.src
                
                // Skip external images (they're already full-size)
                if (isAbsoluteUrl(src)) {
                  return
                }

                // Create a wrapper link element
                const linkElement = {
                  type: "element" as const,
                  tagName: "a",
                  properties: {
                    href: src,
                    target: opts.openInNewTab ? "_blank" : undefined,
                    rel: opts.openInNewTab ? "noopener noreferrer" : undefined,
                    class: "clickable-image",
                    "aria-label": `View full-size image: ${node.properties.alt || "image"}`,
                  },
                  children: [node],
                }

                // Replace the img element with the link wrapper
                if (parent && index !== undefined) {
                  parent.children[index] = linkElement
                }
              }
            })
          }
        },
      ]
    },
    externalResources() {
      return {
        css: [
          {
            content: `
              .clickable-image {
                display: inline-block;
                cursor: pointer;
                transition: opacity 0.2s ease;
              }
              
              .clickable-image:hover {
                opacity: 0.8;
              }
              
              .clickable-image img {
                display: block;
                max-width: 100%;
                height: auto;
              }
            `,
            loadTime: "beforeDOMReady",
            contentType: "inline",
          },
        ],
      }
    },
  }
}
