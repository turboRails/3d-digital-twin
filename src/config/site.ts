export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Future Monitoring",
  description:
    "Beautifully designed 3D digital twins for monitoring",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    Energy: "/energy",
    Heat: "/heat",
  },
}
