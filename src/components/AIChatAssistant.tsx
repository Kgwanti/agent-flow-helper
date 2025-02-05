import { AIChatContainer } from "./ai-chat/AIChatContainer";
import { useAIChat } from "./ai-chat/useAIChat";
import { AIChatProps } from "./ai-chat/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AIChatAssistant = ({ embedded = false, onClose }: AIChatProps) => {
  const {
    isOpen,
    greeting,
    messages,
    isLoading,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleOpen,
    handleClose,
    emailConfirmation,
    confirmAndSendEmail,
    cancelEmailSend
  } = useAIChat(embedded);

  const handleCloseWrapper = () => {
    handleClose();
    onClose?.();
  };

  return (
    <>
      <AIChatContainer
        embedded={embedded}
        isOpen={isOpen}
        handleOpen={handleOpen}
        handleClose={handleCloseWrapper}
        greeting={greeting}
        messages={messages}
        isLoading={isLoading}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
      />

      <AlertDialog open={emailConfirmation.show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Email Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to send this response as an email to {emailConfirmation.recipientEmail}?
              <div className="mt-2 p-4 bg-gray-100 rounded-md">
                {emailConfirmation.content}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelEmailSend}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAndSendEmail}>Send Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AIChatAssistant;