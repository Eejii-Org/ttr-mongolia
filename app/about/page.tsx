import { supabase } from "@/utils/supabase/client";
import { MemberType } from "@/utils/types";
import { MainLayout, AboutIntro, StorageImage } from "@components";

const getMembers = async () => {
  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .order("order", { ascending: true });
  const administrativeStaffs: MemberType[] =
    members?.filter(
      (member) => member.positionType == "Administrative Staff"
    ) || [];
  const guides: MemberType[] =
    members?.filter((member) => member.positionType == "Guide") || [];
  const drivers: MemberType[] =
    members?.filter((member) => member.positionType == "Driver") || [];
  if (error) {
    console.error(error);
    return { drivers: [], guides: [], administrativeStaffs: [] };
  }
  return { drivers, guides, administrativeStaffs };
};

const About = async () => {
  const { administrativeStaffs, drivers, guides } = await getMembers();
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col gap-12">
        <AboutIntro />
        <div className="container mx-auto flex flex-col gap-4 justify-center px-8 items-center">
          <div className="text-2xl md:text-4xl font-semibold">
            Administrative Staff
          </div>
          <div className="flex flex-row flex-wrap gap-6">
            {administrativeStaffs.map((member, index) => (
              <div
                className="w-64 flex flex-col shadow rounded-lg overflow-hidden"
                key={index}
              >
                <div className="h-64 relative">
                  <StorageImage
                    src={member.image || ""}
                    alt={"image" + member.id}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="font-semibold text-xl">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="font-semibold text-[#6d6d6d]">
                    {member.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {guides.length !== 0 && (
          <div className="container mx-auto flex flex-col gap-4 justify-center px-8 items-center">
            <div className="text-2xl md:text-4xl font-semibold">Guides</div>
            <div className="flex flex-row flex-wrap gap-6">
              {guides.map((member, index) => (
                <div
                  className="w-64 flex flex-col shadow rounded-lg overflow-hidden"
                  key={index}
                >
                  <div className="h-64 relative">
                    <StorageImage
                      src={member.image || ""}
                      alt={"image" + member.id}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="font-semibold text-xl">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="font-semibold text-[#6d6d6d]">
                      {member.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {drivers.length !== 0 && (
          <div className="container mx-auto flex flex-col gap-4 justify-center px-8 items-center">
            <div className="text-2xl md:text-4xl font-semibold">Drivers</div>
            <div className="flex flex-row flex-wrap gap-6">
              {drivers.map((member, index) => (
                <div
                  className="w-64 flex flex-col shadow rounded-lg overflow-hidden"
                  key={index}
                >
                  <div className="h-64 relative">
                    <StorageImage
                      src={member.image || ""}
                      alt={"image" + member.id}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="font-semibold text-xl">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="font-semibold text-[#6d6d6d]">
                      {member.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
export default About;
