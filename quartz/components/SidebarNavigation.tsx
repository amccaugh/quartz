import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const SidebarNavigation: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? {
      "Home": "/",
      "Blog": "/posts/",
      "Help": "/pages/Help-page",
      "Pages": "/pages/",
    }
    
    return (
      <nav class={`sidebar-nav ${displayClass ?? ""}`}>
        <ul class="sidebar-nav-links">
          {Object.entries(links).map(([text, link]) => (
            <li class="sidebar-nav-item">
              <a href={link} class="sidebar-nav-link">{text}</a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  SidebarNavigation.css = `
.sidebar-nav {
  margin-bottom: 2rem;
}

.sidebar-nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-nav-item {
  margin: 0;
}

.sidebar-nav-link {
  display: block;
  color: var(--dark);
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 700;
  font-size: 1.5rem;
  border: 1px solid transparent;
}

.sidebar-nav-link:hover {
  background-color: var(--highlight);
  color: var(--secondary);
  border-color: var(--lightgray);
}

.sidebar-nav-link:focus {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.sidebar-nav-link.active {
  background-color: var(--secondary);
  color: white;
  border-color: var(--secondary);
}

@media (max-width: 768px) {
  .sidebar-nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
  }
}
`

  return SidebarNavigation
}) satisfies QuartzComponentConstructor
