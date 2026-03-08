import { Link, useRevalidator } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  deleteStudent,
  type StudentItem,
} from "../../../services/StudentService";

interface StudentItemCardProps {
  student: StudentItem;
}

export const StudentItemCard = ({ student }: StudentItemCardProps) => {
  const revalidator = useRevalidator();

  const deleteMutation = useMutation({
    mutationFn: () => deleteStudent(student._id),
    onSuccess: () => {
      revalidator.revalidate();
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(`Delete student "${student.name}"? This cannot be undone.`)
    ) {
      deleteMutation.mutate();
    }
  };

  const isDeleting =
    deleteMutation.isPending || revalidator.state === "loading";

  return (
    <div
      className={`card flex items-center gap-5 transition-opacity duration-200 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative flex shrink-0 w-20 h-20">
        <div className="w-full h-full rounded-[20px] bg-[#D9D9D9] overflow-hidden">
          <img
            src={student.photo_url || "/assets/images/photos/photo-3.png"}
            className="w-full h-full object-cover"
            alt={student.name}
          />
        </div>
      </div>

      {/* Info */}
      <div className="w-full">
        <h3 className="font-bold text-xl leading-[30px] line-clamp-1">
          {student.name}
        </h3>
        <div className="flex items-center gap-[6px] mt-[6px]">
          <img
            src="/assets/images/icons/note-favorite-purple.svg"
            className="w-5 h-5"
            alt="icon"
          />
          <p className="text-[#838C9D]">
            {student.courses.length} Course Joined
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3">
        <Link
          to={`/manager/students/edit/${student._id}`}
          className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
        >
          Edit Profile
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

      {deleteMutation.isError && (
        <p className="text-[#FF435A] text-xs w-full text-right">
          Failed to delete. Please try again.
        </p>
      )}
    </div>
  );
};
