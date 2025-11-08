import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  CategoryItem,
  createCourse,
  CreateCourseResponse,
  GetCategoriesResponse,
} from "../../../services/CourseService";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  CreateCourseFormValues,
  createCourseSchema,
} from "../../../utils/ZodSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

export const ManageCreateCoursePage = () => {
  const categoriesResponse = useLoaderData() as GetCategoriesResponse;
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    resetField,
    setError,
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
  });

  const { isPending, mutateAsync } = useMutation<
    CreateCourseResponse,
    AxiosError<{ message?: string }>,
    CreateCourseFormValues
  >({
    mutationFn: (formValues) => createCourse(formValues),
  });

  const onSubmit: SubmitHandler<CreateCourseFormValues> = async (data) => {
    try {
      await mutateAsync(data);
      navigate("/manager/courses", { replace: true });
    } catch (err) {
      const ax = err as AxiosError<{ message?: string }>;
      const serverMsg = ax.response?.data?.message || "Course creation failed.";
      setError("root", { type: "server", message: serverMsg });
      console.error("Course creation failed:", err);
    }
  };

  // Handler untuk input file
  const handleThumbnailChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    } else {
      resetField("thumbnail");
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">
            New Course
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[550px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
        noValidate
      >
        {/* Course Name */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Course Name
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
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
              placeholder="Write better name for your course"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.name?.message}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="relative flex flex-col gap-[10px]">
          <label htmlFor="thumbnail" className="font-semibold">
            Add a Thumbnail
          </label>
          <div
            id="thumbnail-preview-container"
            className="relative flex shrink-0 w-full h-[200px] rounded-[20px] border border-[#CFDBEF] overflow-hidden"
          >
            {/* tampil preview kalo ada */}
            {previewUrl ? (
              <img
                id="thumbnail-preview"
                src={previewUrl}
                className="w-full h-full object-cover z-5"
                alt="thumbnail preview"
              />
            ) : (
              <button
                type="button"
                id="trigger-input"
                onClick={() => inputFileRef.current?.click()}
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center gap-3 z-0"
              >
                <img
                  src="/assets/images/icons/gallery-add-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <span className="text-[#838C9D]">Add an attachment</span>
              </button>
            )}

            {/* tombol apus preview */}
            {previewUrl && (
              <button
                type="button"
                id="delete-preview"
                onClick={() => {
                  resetField("thumbnail");
                  setPreviewUrl(null);
                  if (inputFileRef.current) inputFileRef.current.value = "";
                }}
                className="absolute right-[10px] bottom-[10px] w-12 h-12 rounded-full z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white/75"
              >
                <img src="/assets/images/icons/delete.svg" alt="delete" />
              </button>
            )}
          </div>
          <input
            ref={inputFileRef} 
            type="file"
            id="thumbnail"
            name="thumbnail" 
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleThumbnailChange} 
            className="hidden"
          />
          <span className="error-message text-[#FF435A]">
            {errors?.thumbnail?.message}
          </span>
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="tagline" className="font-semibold">
            Course Tagline
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/bill-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("tagline")}
              type="text"
              id="tagline"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write tagline for better copy"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.tagline?.message}
          </span>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="categoryId" className="font-semibold">
            Select Category
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/bill-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <select
              {...register("categoryId")}
              id="categoryId"
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
            >
              <option value="" hidden>
                Choose one category
              </option>
              {categoriesResponse?.data?.map((item: CategoryItem) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <img
              src="/assets/images/icons/arrow-down.svg"
              className="w-6 h-6"
              alt="icon"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.categoryId?.message}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <div
            className={`flex w-full rounded-[20px] border border-[#CFDBEF] gap-3 p-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
              errors.description ? "ring-2 ring-[#FF435A]" : "border-[#CFDBEF]"
            }`}
          >
            <img
              src="/assets/images/icons/note-black.png"
              className="w-6 h-6"
              alt="icon"
            />
            <textarea
              {...register("description")}
              id="description"
              rows={5}
              className="appearance-none outline-none w-full font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Explain what this course about"
            ></textarea>
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.description?.message}
          </span>
        </div>

        {/* Server error (root) */}
        {errors.root && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm px-3 py-2"
          >
            {errors.root.message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isPending || isSubmitting}
            className="w-full rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap"
          >
            {isPending || isSubmitting ? "Creating..." : "Create Now"}
          </button>
        </div>
      </form>
    </>
  );
};
