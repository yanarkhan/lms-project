import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createStudentSchema,
  updateStudentSchema,
  type CreateStudentInput,
  type CreateStudentOutput,
  type UpdateStudentInput,
  type UpdateStudentOutput,
} from "../../../utils/ZodSchema";
import type { StudentDetail } from "../../../services/StudentService";
import { useStudentMutation } from "../../../hooks/useStudentMutation";
import { AvatarPicker } from "./AvatarPicker";

interface StudentFormProps {
  existingStudent?: StudentDetail;
}

const StudentForm = ({ existingStudent }: StudentFormProps) => {
  const isEditMode = existingStudent !== undefined;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const AVATAR_PLACEHOLDER = "/assets/images/photos/photo-3.png";
  const avatarPreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : (existingStudent?.photo_url ?? AVATAR_PLACEHOLDER);

  const createForm = useForm<CreateStudentInput, unknown, CreateStudentOutput>({
    resolver: zodResolver(createStudentSchema),
  });

  const editForm = useForm<UpdateStudentInput, unknown, UpdateStudentOutput>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      name: existingStudent?.name ?? "",
      email: existingStudent?.email ?? "",
      password: "",
    },
  });

  const form = isEditMode ? editForm : createForm;
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  const { mutate, isPending, isError, errorMessage } = useStudentMutation({
    mode: isEditMode ? "edit" : "create",
    studentId: existingStudent?._id,
  });

  // Avatar handlers
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setValue("photo" as never, file as never, { shouldValidate: true });
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    setValue("photo" as never, undefined as never, { shouldValidate: false });
  };

  // Submit
  const onSubmitCreate = async (values: CreateStudentOutput) => {
    try {
      await mutate({ mode: "create", data: values });
    } catch {}
  };

  const onSubmitEdit = async (values: UpdateStudentOutput) => {
    try {
      await mutate({ mode: "edit", data: values });
    } catch {}
  };

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">
            {isEditMode ? "Edit" : "Add"} Student
          </h1>
          <p className="text-[#838C9D] mt-[1]">Create new future for company</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="#"
            className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Import from BWA
          </Link>
        </div>
      </header>
      {isError && errorMessage && (
        <div className="w-[550px] px-5 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={
          isEditMode
            ? editForm.handleSubmit(onSubmitEdit)
            : createForm.handleSubmit(onSubmitCreate)
        }
        className="flex flex-col w-[550px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        {/* Avatar */}
        <AvatarPicker
          previewUrl={avatarPreviewUrl}
          onFileSelect={handleFileSelect}
          onClear={handleFileClear}
          hasFile={selectedFile !== null}
          errorMessage={errors.photo?.message as string | undefined}
        />

        {/* Name */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="name" className="font-semibold">
            Full Name
          </label>
          <div
            className={`flex items-center w-full rounded-full border gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
              errors.name ? "border-red-400" : "border-[#CFDBEF]"
            }`}
          >
            <img
              src="/assets/images/icons/note-favorite-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("name")}
              type="text"
              id="name"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write student's full name"
            />
          </div>
          {errors.name && (
            <span className="text-[#FF435A] text-sm">
              {errors.name.message as string}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="email" className="font-semibold">
            Email Address
          </label>
          <div
            className={`flex items-center w-full rounded-full border gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
              errors.email ? "border-red-400" : "border-[#CFDBEF]"
            }`}
          >
            <img
              src="/assets/images/icons/sms-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("email")}
              type="email"
              id="email"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write student's email address"
            />
          </div>
          {errors.email && (
            <span className="text-[#FF435A] text-sm">
              {errors.email.message as string}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="password" className="font-semibold">
            Password{" "}
            {isEditMode && (
              <span className="text-[#838C9D] font-normal text-sm">
                (leave blank to keep current)
              </span>
            )}
          </label>
          <div
            className={`flex items-center w-full rounded-full border gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
              errors.password ? "border-red-400" : "border-[#CFDBEF]"
            }`}
          >
            <img
              src="/assets/images/icons/lock-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("password")}
              type="password"
              id="password"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder={
                isEditMode ? "Leave blank to keep current" : "Type password"
              }
            />
          </div>
          {errors.password && (
            <span className="text-[#FF435A] text-sm">
              {errors.password.message as string}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            disabled={isPending}
            className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : isEditMode ? "Edit Now" : "Add Now"}
          </button>
        </div>
      </form>
    </>
  );
};

const ManageStudentCreatePage = () => {
  const existingStudent = useLoaderData() as StudentDetail | undefined;

  return <StudentForm existingStudent={existingStudent} />;
};

export default ManageStudentCreatePage;
