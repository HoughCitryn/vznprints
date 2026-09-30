import type { PageSeo, SiteConfig } from "@/content/models";

export type { ContactSubmission, PageSeo, QuoteSubmission, ServicePageContent, SiteConfig } from "@/content/models";

export const mediaRoot = "/wp-content/uploads/2019";

export const siteConfig: SiteConfig = {
  name: "VZN Prints",
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://vznprints.com").origin,
  phone: "+16615463113",
  phoneDisplay: "661-546-3113",
  email: "contact@vznprints.com",
  location: "Bakersfield, CA",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Apparel", href: "/apparel/" },
    { label: "Marketing Material", href: "/marketing-material/" },
    { label: "Graphic Design", href: "/graphic-design/" },
    { label: "Contact Us", href: "/contact-us/" },
  ],
  social: {
    instagram: "https://www.instagram.com/vznprints/",
    facebook: "https://www.facebook.com/VznPrintsBakersfield/",
  },
};

export const pageSeo = {
  home: {
    title: "VZN Prints | Print Shop in Bakersfield, CA",
    description:
      "VZN Prints is your one stop print shop in Bakersfield. Our printing service can help your business stand out with our marketing solutions. Call 661-546-3113",
    path: "/",
  },
  apparel: {
    title: "T-Shirt Printing & Embroidery in Bakersfield | VZN Prints",
    description:
      "Custom T-shirt printing, embroidery, and screen printing in Bakersfield. Call VZN Prints at 661-546-3113 for fast, affordable custom apparel.",
    path: "/apparel/",
  },
  marketing: {
    title: "Banners & Marketing Materials in Bakersfield | VZN Prints",
    description:
      "Print business cards, brochures, banners, signs, mugs, bags, posters, and more in Bakersfield. Call VZN Prints at 661-546-3113.",
    path: "/marketing-material/",
  },
  graphicDesign: {
    title: "Graphic Design Services in Bakersfield, CA | VZN Prints",
    description:
      "In-house graphic design, logo creation, and artwork recreation for Bakersfield businesses. Contact VZN Prints to bring your project to life.",
    path: "/graphic-design/",
  },
  contact: {
    title: "Contact VZN Prints | Bakersfield Print Shop",
    description:
      "Contact VZN Prints in Bakersfield for apparel printing, embroidery, marketing materials, graphic design, and custom print projects.",
    path: "/contact-us/",
  },
  quote: {
    title: "Get a Printing Quote in Bakersfield | VZN Prints",
    description:
      "Request a quote for custom apparel, embroidery, banners, marketing materials, and graphic design from VZN Prints in Bakersfield.",
    path: "/quote/",
  },
} satisfies Record<string, PageSeo>;

export const homeSellingPoints = [
  { title: "Quick Turn-Around Time", detail: "Available on All Orders", icon: "clock" },
  { title: "Guaranteed Highest Quality", detail: "On All Products Stocked", icon: "tag" },
  { title: "Affordable Print Prices", detail: "Every Order. Every Time.", icon: "money" },
] as const;

export const homeServices = [
  {
    title: "Apparel Printing",
    description:
      "View the type of items that we can print and customize. T-Shirt printing in Bakersfield is now affordable and fast! Tees, hats, jackets and more.",
    href: "/apparel/",
    image: `${mediaRoot}/03/T-Shirt-Printing-in-Bakersfield.jpg`,
  },
  {
    title: "Marketing Material",
    description:
      "Take your business to the next level with our Bakersfield printing services such as brochures, flyers, banners, business cards and more.",
    href: "/marketing-material/",
    image: `${mediaRoot}/02/Business-Card-Printing-Bakersfield-CA.jpg`,
  },
  {
    title: "Embroidery",
    description:
      "Looking for embroidery services in Bakersfield? We can embroider multiple types of garments with your business’ logo.",
    href: "/apparel/",
    image: `${mediaRoot}/02/Embroidery-Bakersfield-CA.jpg`,
  },
  {
    title: "Graphic Design",
    description:
      "Our in-house graphic design team can handle any project at hand. Whether it’s a brand new logo or recreation of an old piece.",
    href: "/graphic-design/",
    image: `${mediaRoot}/02/Graphic-Design-Bakersfield-CA.jpg`,
  },
] as const;

export const productList = [
  "T-Shirts | Jackets | Hoodies | Hats",
  "Medical Scrubs | Jerseys | Staff Apparel",
  "Brochures | Flyers | Business Cards | Banners",
  "Pens | Mugs | Folders | Bags | Posters | Stand-Up Signs",
] as const;

export const recommendedBrands = [
  { name: "BELLA+CANVAS", src: `${mediaRoot}/02/bella2.png`, width: 450, height: 300 },
  { name: "American Apparel", src: `${mediaRoot}/02/aa.png`, width: 450, height: 300 },
  { name: "ei-lo", src: `${mediaRoot}/02/logo-ei-lo.png`, width: 462, height: 174 },
  { name: "Anvil", src: `${mediaRoot}/02/Anvil.png`, width: 751, height: 192 },
] as const;

export const occasions = [
  {
    title: "Fundraisers & Events",
    description:
      "Call our print shop in Bakersfield whether you’re hosting a large or small fundraiser or event. Ask for bulk pricing when looking to print a large number of shirts for your event, we can help you with any event!",
  },
  {
    title: "Exclusive Brands",
    description:
      "Custom label tags, blind drop shipping, and more exclusive services to make your brand look professional. Allow your brand to expand quickly with VZN Prints Bakersfield printing custom solutions.",
  },
  {
    title: "Promo Items",
    description:
      "Our print shop in Bakersfield provides a wide range of promo items to spruce up the companies look. Whether you’re looking for collateral to hand out at an event or something to surprise the employees, we print it all.",
  },
] as const;

export const printMethods = [
  {
    title: "Heat Transfer Vinyl",
    image: `${mediaRoot}/02/T-Shirt-Printing-Bakersfield-CA.jpg`,
    description:
      "Heat Transfer Vinyl (HTV) is a great long-lasting option for printing on t-shirts of all types. Our personal favorite method of t-shirt printing, White Toner has full-color capability in multiple finishes. If you are looking for this type of T-shirt printing in Bakersfield, then contact us today for a ",
  },
  {
    title: "Embroidery",
    image: `${mediaRoot}/02/Embroidery-Bakersfield-CA.jpg`,
    description:
      "Looking to embroider a hat or polo? Maybe even a jacket or bag? We provide embroidery options to our customers on a variety of different items. Contact us today for more information regarding your project. If you are looking for Embroidery services in Bakersfield, then contact us today for a ",
  },
  {
    title: "Screen Print",
    image: `${mediaRoot}/02/okay-min.jpg`,
    description:
      "Screen Printing t-shirts is a generic method of printing and can be found to be inexpensive when purchased in bulk amounts such as fundraisers and large events. We offer multi-color print on a range of different materials. If you are looking for screen printing in Bakersfield, then contact us today for a ",
  },
] as const;

export const garments = [
  { title: "T-Shirts", src: `${mediaRoot}/03/T-Shirt1.png` },
  { title: "Long Sleeves", src: `${mediaRoot}/03/Long-Sleeve1.png` },
  { title: "Polos", src: `${mediaRoot}/03/Polo1.png` },
  { title: "Sweatshirts", src: `${mediaRoot}/03/Hoodie1.png` },
  { title: "Restaurants", src: `${mediaRoot}/03/Restaurant1.png` },
  { title: "Crewnecks", src: `${mediaRoot}/03/Crewneck1.png` },
  { title: "Hats", src: `${mediaRoot}/03/Hats.png` },
  { title: "Bottoms", src: `${mediaRoot}/03/Bottoms1.png` },
] as const;

export const fabrics = [
  { title: "100% Cotton", src: `${mediaRoot}/03/100.png` },
  { title: "100% Polyester", src: `${mediaRoot}/03/100.png` },
  { title: "50% Cotton\n50% Polyester", src: `${mediaRoot}/03/50-50.png` },
  { title: "Dri-Blend", src: `${mediaRoot}/03/Dri.png` },
  { title: "Poly Rich", src: `${mediaRoot}/03/Poly.png` },
] as const;

export const marketingItems = [
  {
    title: "Business Cards",
    description:
      "We print a variety of Business Card types, such as Gloss, Matte, Raise Text, Plastic and many more. We also provide amazing in house designs finished within 48 hours.",
  },
  {
    title: "Brochures",
    description:
      "Mutipule sizes of brochures are available for print. Tri-Fold, Bi-Fold and Z-Fold. Many other options are available per customer request.",
  },
  {
    title: "Banners",
    description:
      "Small Banners to large banners, we print them all. Unlimited colors are available with the option for durable brass grommets. We are one of the cheapest Bakersfield Banner printing companies in town!",
  },
  {
    title: "Mugs",
    description:
      "Providing multiple types of mugs, large to small. We give our customer the option to print single or double side, including an option for a color matching interior and handle.",
  },
  {
    title: "Pens",
    description:
      "We provide multiple options of styles of pens along with a variety of colors to choose from. Print your logo on a basic plastic pen or sleek, durable pen.",
  },
  {
    title: "Bags",
    description:
      "Whether you’re looking for simple plastic bags or custom tote bags we’ve got you covered. Customize your bag to your liking and let us get to printing!",
  },
  {
    title: "Signs",
    description:
      "We can print stand-up signs for the exterior of your building or we can print small table signs for the office. We give our clients a unique option to print custom sized signs.",
  },
  {
    title: "Posters",
    description:
      "Let us customize new posters for your office or event. We can also reprint old posters that need replacement.",
  },
] as const;

export const artworkExamples = [
  { src: `${mediaRoot}/03/Render-1d.png`, alt: "Rendered graphic design example" },
  { src: `${mediaRoot}/03/Fish-Logo.png`, alt: "Fish logo design example" },
  { src: `${mediaRoot}/03/vdsd.png`, alt: "VZN Prints artwork design example" },
] as const;

export const visiblePageImages = {
  home: [
    `${mediaRoot}/02/T-Shirt-Printing-Bakersfield-CA.jpg`,
    ...homeServices.map((service) => service.image),
    ...recommendedBrands.map((brand) => brand.src),
    `${mediaRoot}/03/Untitled-design.png`,
  ],
  apparel: [
    `${mediaRoot}/03/Webp.net-resizeimage-1-min.jpg`,
    ...printMethods.map((method) => method.image),
    ...garments.map((garment) => garment.src),
    ...fabrics.map((fabric) => fabric.src),
  ],
  marketing: [
    `${mediaRoot}/02/Business-Card-Printing-Bakersfield-CA.jpg`,
  ],
  graphicDesign: [
    `${mediaRoot}/02/life-coach-26.jpg`,
    ...artworkExamples.map((example) => example.src),
  ],
  contact: [`${mediaRoot}/02/black-and-white-lights-abstract-curves.jpg`],
  quote: [`${mediaRoot}/02/black-and-white-lights-abstract-curves.jpg`],
} as const;

export const serviceOptions = [
  "Apparel Printing",
  "Marketing Material",
  "Embroidery",
  "Graphic Design",
  "Other",
] as const;

export const allMediaAssets = [
  "/wp-content/uploads/2019/02/aa.png",
  "/wp-content/uploads/2019/02/Anvil.png",
  "/wp-content/uploads/2019/02/bella2.png",
  "/wp-content/uploads/2019/02/black-and-white-lights-abstract-curves.jpg",
  "/wp-content/uploads/2019/02/Business-Card-Printing-Bakersfield-CA.jpg",
  "/wp-content/uploads/2019/02/cropped-Favicon3-1.png",
  "/wp-content/uploads/2019/02/cropped-Favicon3.png",
  "/wp-content/uploads/2019/02/Embroidery-Bakersfield-CA.jpg",
  "/wp-content/uploads/2019/02/Favicon3.png",
  "/wp-content/uploads/2019/02/Graphic-Design-Bakersfield-CA.jpg",
  "/wp-content/uploads/2019/02/life-coach-03-1.jpg",
  "/wp-content/uploads/2019/02/life-coach-26.jpg",
  "/wp-content/uploads/2019/02/logo-ei-lo.png",
  "/wp-content/uploads/2019/02/okay-min.jpg",
  "/wp-content/uploads/2019/02/T-Shirt-Printing-Bakersfield-CA.jpg",
  "/wp-content/uploads/2019/02/VZN-LOGO.png",
  "/wp-content/uploads/2019/02/Webp.net-resizeimage-min.jpg",
  "/wp-content/uploads/2019/02/ZVN-LOGO.png",
  "/wp-content/uploads/2019/03/100.png",
  "/wp-content/uploads/2019/03/50-50.png",
  "/wp-content/uploads/2019/03/Bottoms1.png",
  "/wp-content/uploads/2019/03/Crewneck1.png",
  "/wp-content/uploads/2019/03/Dri.png",
  "/wp-content/uploads/2019/03/Fish-Logo.png",
  "/wp-content/uploads/2019/03/golf_course_40.png",
  "/wp-content/uploads/2019/03/Hats.png",
  "/wp-content/uploads/2019/03/Hoodie1.png",
  "/wp-content/uploads/2019/03/Jacket1.png",
  "/wp-content/uploads/2019/03/Long-Sleeve1.png",
  "/wp-content/uploads/2019/03/Polo1.png",
  "/wp-content/uploads/2019/03/Poly.png",
  "/wp-content/uploads/2019/03/Render-1d.png",
  "/wp-content/uploads/2019/03/Restaurant1.png",
  "/wp-content/uploads/2019/03/T-Shirt-Printing-in-Bakersfield.jpg",
  "/wp-content/uploads/2019/03/T-Shirt1.png",
  "/wp-content/uploads/2019/03/Untitled-design.png",
  "/wp-content/uploads/2019/03/vdsd.png",
  "/wp-content/uploads/2019/03/Webp.net-resizeimage-1-min.jpg",
] as const;
