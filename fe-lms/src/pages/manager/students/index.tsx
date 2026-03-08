import { Link, useLoaderData } from "react-router-dom";
import type { StudentItem } from "../../../services/StudentService";
import { StudentItemCard } from "./StudentItem";

export default function ManageStudentsPage() {
  const students = useLoaderData() as StudentItem[];

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">
            Manage Students
          </h1>
          <p className="text-[#838C9D] mt-[1]">
            Keep your employee or student happy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="#"
            className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Import File
          </Link>
          <Link
            to="/manager/students/create"
            className="w-fit rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap"
          >
            Add Student
          </Link>
        </div>
      </header>

      <section
        id="StudentList"
        className="flex flex-col w-full rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        {students.length === 0 ? (
          <p className="text-center text-[#838C9D] py-10">
            No students yet. Start by adding your first student.
          </p>
        ) : (
          students.map((student) => (
            <StudentItemCard key={student._id} student={student} />
          ))
        )}
      </section>
    </>
  );
}
