export const Map = ({ src }: { src: string }) => {
  return (
    <div className="h-64 md:h-[400px] 2xl:h-[600px] overflow-hidden flex-1 flex">
      <iframe
        src={src}
        className="h-[316px] md:h-[460px] 2xl:h-[660px] border-0 -mt-[60px] flex-1"
      ></iframe>
    </div>
  );
};
