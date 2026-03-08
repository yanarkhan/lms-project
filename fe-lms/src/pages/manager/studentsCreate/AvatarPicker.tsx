import { useRef } from "react";

interface AvatarPickerProps {
  previewUrl: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  hasFile: boolean;
  errorMessage?: string;
}

export const AvatarPicker = ({
  previewUrl,
  onFileSelect,
  onClear,
  hasFile,
  errorMessage,
}: AvatarPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-[10px]">
      <label className="font-semibold">Add an Avatar</label>
      <div className="flex items-center gap-[14px]">
        {/* Preview container */}
        <div className="relative flex shrink-0 w-20 h-20 rounded-[20px] border border-[#CFDBEF] overflow-hidden bg-[#D9D9D9]">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex justify-center items-center z-0"
          >
            <img
              src="/assets/images/icons/gallery-add-black.svg"
              className="w-6 h-6"
              alt="upload"
            />
          </button>
          <img
            src={previewUrl}
            className="w-full h-full object-cover relative z-10"
            alt="avatar preview"
          />
        </div>

        {/* Clear button */}
        {hasFile && (
          <button
            type="button"
            onClick={onClear}
            className="w-12 h-12 rounded-full"
          >
            <img src="/assets/images/icons/delete.svg" alt="remove" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) onFileSelect(selected);
          e.target.value = "";
        }}
        className="hidden"
      />

      {errorMessage && (
        <span className="text-[#FF435A] text-sm">{errorMessage}</span>
      )}
    </div>
  );
};
