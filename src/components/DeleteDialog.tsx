import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

type DeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
};

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  ...props
}: DeleteDialogProps) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize={'lg'} fontWeight={'bold'}>
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{props.children}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              ml={3}
              bgColor={'red.500'}
              color={'white'}
              _hover={{
                bgColor: 'red.600',
              }}
              _active={{
                bgColor: 'red.700',
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
