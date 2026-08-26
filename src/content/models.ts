export type PageSeo = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export type NavigationItem = {
  label: string;
  href: `/${string}` | "/";
};

export type SiteConfig = {
  name: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  location: string;
  navigation: NavigationItem[];
  social: { instagram: string; facebook: string };
};

export type ServicePageContent = {
  seo: PageSeo;
  heading: string;
  subheading?: string;
  heroImage: string;
};

export type ContactSubmission = {
  name: string;
  phone: string;
  email: string;
  message: string;
  turnstileToken: string;
  website?: string;
};

export type QuoteSubmission = {
  name: string;
  company?: string;
  phone: string;
  email: string;
  service: "Apparel Printing" | "Marketing Material" | "Embroidery" | "Graphic Design" | "Other";
  quantity: string;
  neededBy?: string;
  projectDetails: string;
  turnstileToken: string;
  website?: string;
};
