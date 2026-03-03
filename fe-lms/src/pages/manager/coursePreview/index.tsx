import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  type CourseDetailPreviewData,
  type CourseContentItemFull,
} from "../../../services/CourseService";
import { ContentText } from "./ContentText";
import { ContentVideo } from "./ContentVideo";

const ManageCoursePreviewPage = () => {
  const course = useLoaderData() as CourseDetailPreviewData;

  const [activeContentId, setActiveContentId] = useState<string>(
    course.details[0]?._id ?? "",
  );

  const activeContent: CourseContentItemFull | undefined =
    course.details.find((c) => c._id === activeContentId) ?? course.details[0];

  const handleNextContent = () => {
    const currentIndex = course.details.findIndex(
      (c) => c._id === activeContentId,
    );
    const nextContent = course.details[currentIndex + 1];
    if (nextContent) {
      setActiveContentId(nextContent._id);
    }
  };

  const isLastContent =
    course.details.findIndex((c) => c._id === activeContentId) ===
    course.details.length - 1;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar-container fixed h-[calc(100vh-20px)] w-full max-w-[330px] my-[10px] ml-[10px] bg-[#060A23] overflow-hidden flex flex-1 rounded-[20px]">
        <div className="scroll-container flex w-full overflow-y-scroll hide-scrollbar">
          <nav className="flex flex-col w-full h-fit p-[30px] gap-[30px] z-10">
            <Link
              to={`/manager/courses/${course._id}`}
              className="font-semibold text-white hover:underline"
            >
              <span>Back to Dashboard</span>
            </Link>

            {/* Course info */}
            <div className="flex flex-col gap-4">
              <div className="flex shrink-0 w-[130px] h-[100px] rounded-[14px] bg-[#D9D9D9] overflow-hidden">
                <img
                  src={course.thumbnail_url}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
              <h2 className="font-bold text-xl leading-[34px] text-white">
                {course.name}
              </h2>
            </div>

            {/* Content list */}
            {course.details.length === 0 ? (
              <p className="text-[#838C9D] text-sm">No content available.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {course.details.map((content) => {
                  const isActive = content._id === activeContentId;
                  const iconSrc =
                    content.type === "text"
                      ? "/assets/images/icons/note-white.svg"
                      : "/assets/images/icons/video-play-white.svg";

                  return (
                    <li key={content._id}>
                      <button
                        type="button"
                        onClick={() => setActiveContentId(content._id)}
                        className={`flex items-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 text-left ${
                          isActive
                            ? "bg-[#662FFF] border-[#8661EE] shadow-[-10px_-6px_10px_0_#7F33FF_inset]"
                            : "bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset] hover:bg-[#662FFF] hover:border-[#8661EE]"
                        }`}
                      >
                        <img
                          src={iconSrc}
                          className="w-6 h-6 shrink-0"
                          alt={content.type}
                        />
                        <span className="w-full font-semibold text-white line-clamp-1">
                          {content.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </div>
        <img
          src="/assets/images/backgrounds/sidebar-glow.png"
          className="absolute object-contain object-bottom bottom-0"
          alt="background"
        />
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-1 gap-[30px] p-[30px] ml-[340px]">
        {activeContent === undefined ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-[#838C9D]">
              Select a content item from the sidebar.
            </p>
          </div>
        ) : activeContent.type === "text" ? (
          <ContentText
            title={activeContent.title}
            text={activeContent.text ?? ""}
            onNext={handleNextContent}
            isLast={isLastContent}
          />
        ) : (
          <ContentVideo
            title={activeContent.title}
            youtubeId={activeContent.youtubeId ?? ""}
            onNext={handleNextContent}
            isLast={isLastContent}
          />
        )}
      </main>
    </div>
  );
};

export default ManageCoursePreviewPage;
