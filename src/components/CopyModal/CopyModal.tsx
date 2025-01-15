import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { useEvent } from '@hooks/useEvent';
import formatDate from '@lib/formatDate';
import { Person } from '@types';
import { useRef, useState } from 'react';

type CopyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  settlements: {
    from: string;
    to: string;
    amount: number;
  }[];
};

export default function CopyModal({ isOpen, onClose, settlements }: CopyModalProps) {
  const { currentEvent } = useEvent();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  function parseMember(member: Person) {
    if (member.email && member.cvu) {
      return `• ${member.name}: ${member.email} (email) - ${member.cvu} (CVU)`;
    } else if (member.email && !member.cvu) {
      return `• ${member.name}: ${member.email} (email)`;
    } else if (!member.email && member.cvu) {
      return `• ${member.name}: ${member.cvu} (CVU)`;
    } else {
      return `• ${member.name}`;
    }
  }

  const handleCopy = async () => {
    if (textAreaRef.current) {
      try {
        await navigator.clipboard.writeText(textAreaRef.current.value);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          onClose();
        }, 2000);
      } catch (err) {
        console.error('Clipboard API failed, trying legacy method: ', err);
        try {
          textAreaRef.current.select();
          document.execCommand('copy');
          onClose();
        } catch (err) {
          console.error('All copy methods failed: ', err);
          setIsCopied(false);
          return;
        }
      }
    }
  };

  function getEditableContentValue() {
    return `**${currentEvent.name}**
*Fecha: ${formatDate(currentEvent.date)}*

-Deudas-
${settlements.map(({ from, to, amount }) => `• ${from} le debe a ${to}: $${amount}`).join('\n')}

-Items-
${currentEvent.items
  .map(
    (item, index) =>
      `${index + 1}) ${item.description} ($${item.paidBy.reduce(
        (acc, member) => acc + member.amount,
        0
      )})`
  )
  .join('\n')}

-Participantes-
${currentEvent.members.map((member) => parseMember(member)).join('\n')}
    `;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={{
        base: 'sm',
        md: 'md',
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Copiar Información</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            ref={textAreaRef}
            defaultValue={getEditableContentValue()}
            resize={'none'}
            minH={200}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleCopy} isLoading={isCopied}>
            Copiar al portapapeles
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
