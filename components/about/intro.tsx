import StorageImage from "../storageimage";
export const AboutIntro = () => {
  return (
    <div className="container m-auto flex flex-col-reverse md:flex-row gap-6 pt-8 items-center px-8">
      <div className="flex-1 flex flex-col items-start gap-12">
        <div className="flex flex-col gap-4">
          <div className="text-3xl md:text-6xl font-bold uppercase leading-tight">
            <span className="text-primary">#</span> About Us
          </div>
          <div className="pr-8 flex flex-col text-base md:text-lg gap-2">
            <p>
              Dear travelers,
            </p>
            <p>
              Welcome to TTR Mongolia, your gateway to the extraordinary in Mongolia. Located in the heart of Ulaanbaatar, we've had the pleasure of welcoming you since 2013 and accompanying you as you discover our magnificent country.
            </p>
            <p>Our agency specializes in creating tailor-made trips to suit your desires and interests. We firmly believe that every trip is a unique adventure, which is why we've developed immersive programs like our "Nomad Experiences". For 5 to 7 days, you'll have the opportunity to live with nomadic families, participate in their daily activities, and learn the traditions and customs that make our culture so rich.</p>
            <p>We also place particular emphasis on the Amarbayasgalant Monastery, one of Mongolia's spiritual gems. Through our tours and activities in this emblematic place, we offer you the opportunity to reconnect with yourself and with nature. We're delighted to announce our next Meditation Stay program, a 10-day retreat within the monastery, where you can explore inner peace while immersing yourself in a majestic setting.</p>
            <p>We are also passionate about volunteering, and seek to integrate these activities into the heart of our trips. We believe that every trip can have a positive impact, which is why we offer our travelers the chance to participate in social development projects during their stay in Mongolia. Whether it's giving English lessons to young monks in a monastery or replanting trees to combat desertification, every gesture counts. We are actively working to develop new initiatives to enable our customers to contribute to the preservation of our culture and environment while living enriching experiences.</p>
            <p>We look forward to sharing the wild beauty and spiritual depth of our country with you. Join us for an unforgettable experience.</p>
            <p>We look forward to welcoming you to Mongolia,</p>
            <p>Doljinsuren Erdenebat</p>
            <p>Director, TTR Mongolia</p>
          </div>
        </div>
      </div>
      <div className="flex-1 relative min-h-80 w-full md:h-[min(596px,70vh)] rounded-lg overflow-hidden">
        <StorageImage
          src="images/about-us.webp"
          alt="intro"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default AboutIntro;
