import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { createStudent, updateStudent } from "../services/StudentService";
import type {
  CreateStudentOutput,
  UpdateStudentOutput,
} from "../utils/ZodSchema";

type MutationMode = "create" | "edit";

interface UseStudentMutationOptions {
  mode: MutationMode;
  studentId?: string;
}

type StudentMutationPayload =
  | { mode: "create"; data: CreateStudentOutput }
  | { mode: "edit"; data: UpdateStudentOutput };

interface UseStudentMutationReturn {
  mutate: (payload: StudentMutationPayload) => Promise<void>;
  isPending: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useStudentMutation = ({
  mode,
  studentId,
}: UseStudentMutationOptions): UseStudentMutationReturn => {
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (data: CreateStudentOutput) => createStudent(data),
    onSuccess: () => {
      navigate("/manager/students");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateStudentOutput) => {
      if (!studentId) throw new Error("studentId is required for edit mode");
      return updateStudent(studentId, data);
    },
    onSuccess: () => {
      navigate("/manager/students");
    },
  });

  const activeMutation = mode === "create" ? createMutation : updateMutation;

  const parseErrorMessage = (error: Error | null): string | null => {
    if (!error) return null;
    if (isAxiosError(error)) {
      if (error.response?.status === 409) {
        return error.response.data?.message ?? "Email already in use";
      }
      return error.response?.data?.message ?? "An error occurred";
    }
    return error.message;
  };

  const mutate = async (payload: StudentMutationPayload): Promise<void> => {
    if (payload.mode === "create") {
      await createMutation.mutateAsync(payload.data);
    } else {
      await updateMutation.mutateAsync(payload.data);
    }
  };

  return {
    mutate,
    isPending: activeMutation.isPending,
    isError: activeMutation.isError,
    errorMessage: parseErrorMessage(activeMutation.error),
  };
};
