import { Link } from "react-router-dom";
import { useRevalidator } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteContent, type CourseContentItem } from "../../../services/CourseService";

interface ContentItemProps {
  item: CourseContentItem;
  index: number;
  courseId: string;
}

export const ContentItem = ({ item, index, courseId }: ContentItemProps) => {
  const revalidator = useRevalidator();
  const deleteMutation = useMutation({
    mutationFn: () => deleteContent(item._id),
    onSuccess: () => {
      revalidator.revalidate();
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${item.title}"? This action cannot be undone.`,
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const isDeleting =
    deleteMutation.isPending ||
    revalidator.state === "loading";

  return (
    <div
      className={`card flex items-center gap-5 transition-opacity duration-200 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Thumbnail + Index */}
      <div className="relative flex shrink-0 w-[140px] h-[110px]">
        <p className="absolute -top-[10px] -left-[10px] flex shrink-0 w-[30px] h-[30px] rounded-full items-center justify-center text-center bg-[#662FFF] text-white">
          <span className="font-bold text-sm leading-[21px]">{index}</span>
        </p>
        <div className="rounded-[20px] bg-[#D9D9D9] overflow-hidden">
          <img
            src={`/assets/images/thumbnails/cover-${item.type}.png`}
            className="w-full h-full object-cover"
            alt={item.type}
          />
        </div>
      </div>

      {/* Info */}
      <div className="w-full">
        <h3 className="font-bold text-xl leading-[30px] line-clamp-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-[6px] mt-[6px]">
          <img
            src="/assets/images/icons/note-favorite-purple.svg"
            className="w-5 h-5"
            alt="icon"
          />
          <p className="text-[#838C9D]">
            {item.type === "video" ? "Video Content" : "Text Content"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3">
        <Link
          to={`/manager/courses/${courseId}/edit/${item._id}`}
          className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
        >
          Edit Content
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-fit rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white text-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Error state */}
      {deleteMutation.isError && (
        <p className="text-[#FF435A] text-xs mt-1 w-full text-right">
          Failed to delete. Please try again.
        </p>
      )}
    </div>
  );
};