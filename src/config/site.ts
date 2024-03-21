export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Digital twin in 3D",
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
