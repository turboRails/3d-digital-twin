export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "A 3D digital twin",
  description:
    "Beautifully designed 3D digital twins for monitoring status",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    Energy: "/Energy",
    Heat: "/Heat",
  },
}
