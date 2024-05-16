import { createClient } from "@/utils/supabase/server";

export const revalidate = 3600;

export default async function sitemap() {
  const supabase = createClient();
  const { data: tours } = await supabase
    .from("tours")
    .select(
      "id, title, overview, days, nights, images, categories, displayPrice"
    )
    .eq("status", "active");
  const siteMapPosts =
    tours?.map((tour) => ({
      url: `https://www.ttrmongolia.com/tours/${tour.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    })) || [];
  return [
    {
      url: "https://www.ttrmongolia.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.ttrmongolia.com/volunteering",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.ttrmongolia.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.ttrmongolia.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.ttrmongolia.com/tours",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://www.ttrmongolia.com/privatetour",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.ttrmongolia.com/newdeparture",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...siteMapPosts,
  ];
}
