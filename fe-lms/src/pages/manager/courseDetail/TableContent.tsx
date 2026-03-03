import { Link } from "react-router-dom";
import { CourseContentItem } from "../../../services/CourseService";
import { ContentItem } from "./ContentItem";

interface TableContentProps {
  details: CourseContentItem[];
  courseId: string;
}

export const TableContent = ({ details, courseId }: TableContentProps) => {
  return (
    <section
      id="CourseList"
      className="flex flex-col w-full rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
    >
      <div className="header flex items-center justify-between">
        <h2 className="font-bold text-[22px] leading-[33px]">Course Content</h2>
        <Link
          to={`/manager/courses/${courseId}/create`}
          className="w-fit rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap"
        >
          Add Content
        </Link>
      </div>

      {details.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-[#838C9D]">
          <p>No content yet. Start by adding your first content.</p>
        </div>
      ) : (
        details.map((content, index) => (
          <ContentItem
            key={content._id}
            item={content}
            index={index + 1}
            courseId={courseId}
          />
        ))
      )}
    </section>
  );
};
