import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createContent, updateContent } from "../services/CourseService";
import type { MutateContentOutput } from "../utils/ZodSchema";

type MutationMode = "create" | "edit";

interface UseContentMutationOptions {
  mode: MutationMode;
  courseId: string;
  contentId?: string;
}

interface UseContentMutationReturn {
  mutate: (values: MutateContentOutput) => Promise<void>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export const useContentMutation = ({
  mode,
  courseId,
  contentId,
}: UseContentMutationOptions): UseContentMutationReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: MutateContentOutput) => createContent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-detail", courseId] });
      navigate(`/manager/courses/${courseId}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: MutateContentOutput) => {
      if (!contentId) throw new Error("contentId is required for edit mode");
      return updateContent(contentId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-detail", courseId] });
      navigate(`/manager/courses/${courseId}`);
    },
  });

  const activeMutation = mode === "create" ? createMutation : updateMutation;

  return {
    mutate: async (values) => {
      await activeMutation.mutateAsync(values);
    },
    isPending: activeMutation.isPending,
    isError: activeMutation.isError,
    error: activeMutation.error,
  };
};