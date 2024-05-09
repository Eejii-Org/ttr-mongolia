import { createClient } from "@/utils/supabase/server";
const EXTERNAL_DATA_URL = "https://jsonplaceholder.typicode.com/posts";

type TType = {
  id?: number;
  images: string[];
  title: string;
  overview: string;
  days: number;
  nights: number;
  categories: number[];
  displayPrice: number | null;
};

function generateSiteMap(posts: TType[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.ttrmongolia.com</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/volunteering</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/tours</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/contact</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/about</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/privacypolicy</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/termsandconditions</loc>
     </url>
     <url>
       <loc>https://www.ttrmongolia.com/newdeparture</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`https://www.ttrmongolia.com/tours/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: any }) {
  const supabase = createClient();
  // We make an API call to gather the URLs for our site
  const { data: tours } = await supabase
    .from("tours")
    .select(
      "id, title, overview, days, nights, images, categories, displayPrice"
    )
    .eq("status", "active");

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(tours ? tours : []);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
