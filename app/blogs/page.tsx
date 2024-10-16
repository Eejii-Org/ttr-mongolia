import {
  CustomerSupport,
  HeadBlogs,
  MainLayout,
  StorageImage,
} from "@components";
import { createClient } from "@/utils/supabase/server";
import { convert } from "html-to-text";
import { toDateText } from "@/utils";
import Link from "next/link";

const getBlogs = async () => {
  const supabase = createClient();
  try {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("id, created_at, title, description, image")
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return {
      blogs,
    };
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return {
      blogs: [],
    };
  }
};

const Blogs = async () => {
  const { blogs } = await getBlogs();
  const headlineBlog = blogs[0] || null;
  const followingBlogs =
    blogs.length >= 4 ? blogs.slice(1, 4) : blogs.slice(1, blogs.length);
  const otherBlogs = blogs.slice(4);
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 px-3 lg:p-0 lg:mx-auto lg:container lg:px-4">
        <div className="flex flex-col md:gap-2">
          <div className="text-2xl md:text-4xl font-semibold">Blogs</div>
          <p className="text-base md:text-lg">
            From our latest tours, to an information that any tourist needs. We
            have it here!
          </p>
        </div>
        {headlineBlog ? (
          <HeadBlogs
            headlineBlog={headlineBlog}
            followingBlogs={followingBlogs}
          />
        ) : (
          <div className="flex items-center justify-center font-medium h-80">
            There are no blogs currently!
          </div>
        )}
      </div>
      <CustomerSupport />
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 md:gap-y-12 gap-x-6 px-3 lg:p-0 lg:mx-auto lg:container lg:px-4">
        {otherBlogs.map(
          ({ title, description, image, created_at, id }, index) => (
            <Link
              href={"/blogs/" + id}
              key={index}
              className="flex flex-1 flex-col gap-4"
            >
              <div className="relative h-56 rounded overflow-hidden">
                <StorageImage
                  src={image}
                  alt={"headlineBlogImage"}
                  className="object-cover"
                  quality={5}
                  fill
                  priority
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-bold text-lg md:text-xl">{title}</div>
                <div className="text-sm md:text-base tour-item-description-3 opacity-80">
                  {convert(description)}
                </div>
                <div>{toDateText(created_at)}</div>
              </div>
            </Link>
          )
        )}
      </div>
      {/* <ToursFilter
          combinedToursData={combinedToursData}
          combinedAvailableToursData={combinedAvailableToursData}
          tourCategories={tourCategories}
        /> */}
    </MainLayout>
  );
};

export default Blogs;
