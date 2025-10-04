import { Button } from "@/components/ui/button";
import { GreenButton } from "@/components/GreenButton";

interface FormActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  nextLabel?: string;
  submitLabel?: string;
  backLabel?: string;
  isLoading?: boolean;
}

export function FormActions({
  onBack,
  onNext,
  onSubmit,
  isBackDisabled = false,
  isNextDisabled = false,
  isSubmitDisabled = false,
  showBack = true,
  showNext = true,
  showSubmit = false,
  nextLabel = "Dalej",
  submitLabel = "Zapisz i kontynuuj",
  backLabel = "Wróć",
  isLoading = false,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {showBack && onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isBackDisabled || isLoading}
          className="px-6"
        >
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {showNext && onNext && (
        <GreenButton
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="px-8 h-11"
        >
          {nextLabel}
        </GreenButton>
      )}

      {showSubmit && onSubmit && (
        <GreenButton
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled || isLoading}
          className="px-8 h-11"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Przetwarzanie...
            </span>
          ) : (
            submitLabel
          )}
        </GreenButton>
      )}
    </div>
  );
}

