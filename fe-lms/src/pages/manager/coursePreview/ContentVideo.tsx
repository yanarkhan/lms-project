interface ContentVideoProps {
  title: string;
  youtubeId: string;
  onNext: () => void;
  isLast: boolean;
}

export const ContentVideo = ({ title, youtubeId, onNext, isLast }: ContentVideoProps) => {
  return (
    <>
      <div className="flex shrink-0 h-[calc(100vh-110px-104px)] rounded-[20px] overflow-hidden">
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-5">
        <h1 className="font-bold text-[32px] leading-[48px]">{title}</h1>
        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          className="w-fit rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? "Course Completed" : "Mark as Completed"}
        </button>
      </div>
    </>
  );
};