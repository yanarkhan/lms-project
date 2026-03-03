import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useParams } from "react-router-dom";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import type { EventInfo } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

import { editorConfig } from "../../../config/editorConfig";
import {
  mutateContentSchema,
  type MutateContentInput,
  type MutateContentOutput,
} from "../../../utils/ZodSchema";
import type { ContentData } from "../../../services/CourseService";
import { useContentMutation } from "../../../hooks/useContentMutation";

export const ManageContentCreatePage = () => {
  const { id: courseId, contentId } = useParams<{
    id: string;
    contentId?: string;
  }>();

  const existingContent = useLoaderData() as ContentData | undefined;
  const isEditMode = existingContent !== undefined;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MutateContentInput, unknown, MutateContentOutput>({
    resolver: zodResolver(mutateContentSchema),
    defaultValues: {
      courseId: courseId ?? "",
      title: existingContent?.title ?? "",
      type: existingContent?.type ?? "video",
      youtubeId: existingContent?.youtubeId ?? "",
      text: existingContent?.text ?? "",
    },
  });

  const { mutate, isPending, isError, error } = useContentMutation({
    mode: isEditMode ? "edit" : "create",
    courseId: courseId ?? "",
    contentId,
  });

  const selectedType = watch("type");
  
  const onSubmit = async (values: MutateContentOutput) => {
    try {
      await mutate(values);
    } catch {}
  };

  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-500 font-semibold">
          Invalid URL: Course ID is missing.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div
        id="Breadcrumb"
        className="flex items-center gap-5 *:after:content-['/'] *:after:ml-5"
      >
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          Manage Course
        </span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          Course
        </span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          {isEditMode ? "Edit" : "Add"} Content
        </span>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between gap-[30px]">
        <div className="flex items-center gap-[30px]">
          <div className="flex shrink-0 w-[150px] h-[100px] rounded-[20px] overflow-hidden bg-[#D9D9D9]">
            <img
              src="/assets/images/thumbnails/th-1.png"
              className="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-[28px] leading-[42px]">
              {isEditMode ? "Edit" : "Add"} Content
            </h1>
            <p className="text-[#838C9D] mt-[1]">
              Give a best content for the course
            </p>
          </div>
        </div>
      </header>

      {/* Mutation error */}
      {isError && (
        <div className="w-[930px] px-5 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {error instanceof Error
            ? error.message
            : "An error occurred. Please try again."}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[930px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        <input type="hidden" {...register("courseId")} />

        {/* Title */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Content Title
          </label>
          <div
            className={`flex items-center w-full rounded-full border gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
              errors.title ? "border-red-400" : "border-[#CFDBEF]"
            }`}
          >
            <img
              src="/assets/images/icons/note-favorite-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("title")}
              type="text"
              id="title"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write a clear title for your content"
            />
          </div>
          {errors.title && (
            <span className="text-[#FF435A] text-sm px-2">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="type" className="font-semibold">
            Select Type
          </label>
          <div
            className={`flex items-center w-full rounded-full border gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
              errors.type ? "border-red-400" : "border-[#CFDBEF]"
            }`}
          >
            <img
              src="/assets/images/icons/crown-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <select
              {...register("type")}
              id="type"
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold !bg-transparent"
            >
              <option value="" disabled hidden>
                Choose content type
              </option>
              <option value="video">Video (YouTube)</option>
              <option value="text">Text</option>
            </select>
            <img
              src="/assets/images/icons/arrow-down.svg"
              className="w-6 h-6"
              alt="icon"
            />
          </div>
          {errors.type && (
            <span className="text-[#FF435A] text-sm px-2">
              {errors.type.message}
            </span>
          )}
        </div>

        {/* YouTube ID */}
        {selectedType === "video" && (
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="youtubeId" className="font-semibold">
              YouTube Video ID
            </label>
            <div
              className={`flex items-center w-full rounded-full border gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF] ${
                errors.youtubeId ? "border-red-400" : "border-[#CFDBEF]"
              }`}
            >
              <img
                src="/assets/images/icons/bill-black.svg"
                className="w-6 h-6"
                alt="icon"
              />
              <input
                {...register("youtubeId")}
                type="text"
                id="youtubeId"
                className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
                placeholder="e.g. dQw4w9WgXcQ"
              />
            </div>
            {errors.youtubeId && (
              <span className="text-[#FF435A] text-sm px-2">
                {errors.youtubeId.message}
              </span>
            )}
          </div>
        )}

        {/* Text */}
        {selectedType === "text" && (
          <div className="flex flex-col gap-[10px]">
            <label className="font-semibold">Content Text</label>
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value ?? ""}
                  config={editorConfig}
                  onChange={(_event: EventInfo, editor: ClassicEditor) => {
                    field.onChange(editor.getData());
                  }}
                  onBlur={(_event: EventInfo, _editor: ClassicEditor) => {
                    field.onBlur();
                  }}
                />
              )}
            />
            {errors.text && (
              <span className="text-[#FF435A] text-sm px-2">
                {errors.text.message}
              </span>
            )}
          </div>
        )}

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
            {isPending
              ? "Saving..."
              : isEditMode
                ? "Edit Content Now"
                : "Add Content Now"}
          </button>
        </div>
      </form>
    </>
  );
};
