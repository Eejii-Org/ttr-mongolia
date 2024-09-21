import { MainLayout, RandomBlogs, StorageImage } from "@components";
import _ from "lodash";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { TiptapContent } from "@/components/tiptapcontent";
import { toDateText } from "@/utils";

type Props = {
  params: { blogid: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const blogid = params.blogid;
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", blogid)
    .maybeSingle();
  if (error || !data) {
    throw error;
  }
  const blog = data as BlogType;
  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://www.ttrmongolia.com/blogs/${blog.id}`,
      siteName: "TTR Mongolia",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: blog.title,
      description: blog.description,
    },
  };
}

const getBlogPageDetails = async (blogid: string) => {
  const supabase = createClient();
  try {
    const { data: blog, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", blogid)
      .maybeSingle();
    if (error || !blog) {
      throw error;
    }

    const { data: randomBlogs } = await supabase
      .from("random_blogs")
      .select(`*`)
      .neq("id", blogid)
      .limit(3);

    return {
      blog: blog as BlogType,
      randomBlogs: randomBlogs as BlogType[],
    };
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return {
      tour: null,
      randomBlogs: [],
    };
  }
};

const BlogPage = async ({ params }: { params: { blogid: string } }) => {
  const pageDetails = await getBlogPageDetails(params.blogid);
  const { blog, randomBlogs } = pageDetails;
  if (!blog) {
    redirect("/blogs");
    return;
  }
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 md:gap-12">
        <div className=" w-screen container px-4 mx-auto flex flex-col">
          <div className="flex flex-col items-center gap-3 pb-8">
            <div className="font-bold text-xl lg:text-3xl">{blog.title}</div>
            {blog.created_at && <div>{toDateText(blog.created_at)}</div>}
          </div>
          <div className="h-80 lg:h-[512px] relative rounded overflow-hidden mb-8 lg:mb-12">
            <StorageImage
              src={blog?.image || ""}
              alt={"headlineBlogImage"}
              className="object-cover"
              fill
              priority
            />
          </div>
          <div className="w-full md:px-8 lg:px-16">
            <TiptapContent content={blog?.description} />
          </div>
          <div className="mt-32">
            <RandomBlogs randomBlogs={randomBlogs || []} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPage;
