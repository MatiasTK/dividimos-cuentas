import { Button, SimpleGrid, Stack, Text, useDisclosure } from '@chakra-ui/react';
import CopyModal from '@components/CopyModal/CopyModal';
import useCustomColor from '@hooks/useCustomColor';
import { LuClipboard, LuMail, LuShare2 } from 'react-icons/lu';

type ActionsSectionProps = {
  finalSettlements: { from: string; to: string; amount: number }[];
};

export default function ActionsSection({ finalSettlements }: ActionsSectionProps) {
  const {
    isOpen: isCopyModalOpen,
    onOpen: onCopyModalOpen,
    onClose: onCopyModalClose,
  } = useDisclosure();

  const { cardHoverBgColor } = useCustomColor();

  return (
    <>
      <Stack mt={10} direction={'row'} alignItems={'center'}>
        <LuShare2 size={24} />
        <Text fontWeight={'bold'} ms={2}>
          Acciones
        </Text>
      </Stack>
      <CopyModal
        isOpen={isCopyModalOpen}
        onClose={onCopyModalClose}
        settlements={finalSettlements}
      />
      <SimpleGrid mt={5} gap={4} columns={[2, 3]}>
        <Button
          colorScheme={'blue'}
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'full'}
          py={4}
          gap={2}
          onClick={onCopyModalOpen}
        >
          <LuClipboard size={24} />
          <Text fontSize={'sm'}>Copiar Información</Text>
        </Button>
        <Button
          colorScheme={'blue'}
          display={'flex'}
          flexDir={'column'}
          h={'full'}
          gap={2}
          disabled
          _hover={{
            bgColor: cardHoverBgColor,
          }}
        >
          <LuMail size={24} />
          <Text fontSize={'sm'} w={'100%'} whiteSpace={'pre-wrap'}>
            Enviar mails (próximamente)
          </Text>
        </Button>
      </SimpleGrid>
    </>
  );
}
