import { convert } from "html-to-text";
import StorageImage from "../storageimage";
import { toDateText } from "@/utils";
import Link from "next/link";

export const HeadBlogs = ({
  headlineBlog,
  followingBlogs,
}: {
  headlineBlog: BlogType;
  followingBlogs: BlogType[];
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Link
        href={"/blogs/" + headlineBlog.id}
        className="flex flex-col gap-4 flex-1"
      >
        <div className="h-80 md:h-[400px] relative rounded overflow-hidden">
          <StorageImage
            src={headlineBlog?.image || ""}
            alt={"headlineBlogImage"}
            className="object-cover"
            quality={5}
            fill
            priority
          />
        </div>
        <div className="px-4 flex flex-col gap-3">
          <div className="font-bold text-xl lg:text-3xl">
            {headlineBlog.title}
          </div>
          <div className="text-sm md:text-base tour-item-description-3 opacity-80">
            {convert(headlineBlog.description)}
          </div>
          {headlineBlog?.created_at && (
            <div>{toDateText(headlineBlog.created_at)}</div>
          )}
        </div>
      </Link>
      <div className="flex flex-col gap-6 flex-1">
        {new Array(3).fill(null).map((_, index) => (
          <>
            {followingBlogs?.[index] ? (
              <Link
                href={"/blogs/" + followingBlogs[index]?.id}
                key={index}
                className="flex flex-1"
              >
                <div className="relative w-2/5 rounded overflow-hidden">
                  <StorageImage
                    src={followingBlogs[index]?.image || ""}
                    alt={"followingBlogs[index]Image"}
                    className="object-cover"
                    quality={5}
                    fill
                    priority
                  />
                </div>
                <div className="px-4 flex flex-col gap-2 w-3/5">
                  {followingBlogs?.[index]?.created_at && (
                    <div>
                      {toDateText(followingBlogs[index].created_at || "")}
                    </div>
                  )}
                  <div className="font-bold text-lg md:text-xl">
                    {followingBlogs[index].title}
                  </div>
                  <div className="text-sm md:text-base tour-item-description-3 opacity-80">
                    {convert(followingBlogs[index].description)}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex flex-1" key={index}></div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
