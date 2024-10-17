import Link from "next/link";
import StorageImage from "../storageimage";
import { convert } from "html-to-text";
import { toDateText } from "@/utils";
import { BlogType } from "@/utils/types";

export const RandomBlogs = ({ randomBlogs }: { randomBlogs: BlogType[] }) => {
  if (randomBlogs.length == 0) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="mx-3 md:mx-6 text-2xl md:text-4xl font-semibold">
        Other Blogs
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:p-0 lg:mx-auto lg:container lg:px-4">
        {randomBlogs.map(
          ({ title, description, image, created_at, id }, index) => (
            <Link
              href={"/blogs/" + id}
              key={index}
              className="flex flex-1 flex-col gap-4"
            >
              <div className="relative h-56 rounded overflow-hidden">
                <StorageImage
                  src={image || ""}
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
                {created_at && <div>{toDateText(created_at)}</div>}
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};
