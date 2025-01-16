import {
  Avatar,
  Button,
  ButtonGroup,
  Circle,
  Flex,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import DeleteDialog from '@components/DeleteDialog';
import MemberModal from '@components/MemberModal/MemberModal';
import useCustomColor from '@hooks/useCustomColor';
import { useEvent } from '@hooks/useEvent';
import { Person } from '@types';
import { useState } from 'react';
import { LuUser, LuUserPen, LuUserPlus, LuUserX } from 'react-icons/lu';

export default function MembersSection() {
  const { currentEvent, deleteMember } = useEvent();
  const [selectedMember, setSelectedMember] = useState<Person>();

  const {
    isOpen: isMemberModalOpen,
    onOpen: onMemberModalOpen,
    onClose: onMemberModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteMemberDialogOpen,
    onOpen: onDeleteMemberDialogOpen,
    onClose: onDeleteMemberDialogClose,
  } = useDisclosure();

  const { grayText, cardBgColor, circleBgColor, scrollBarThumbColor, avatarColor } =
    useCustomColor();

  return (
    <>
      <Stack mt={5} direction={'row'} justifyContent={'space-between'}>
        <Flex alignItems={'center'}>
          <LuUser size={24} />
          <Text fontWeight={'bold'} ms={2}>
            Miembros
          </Text>
          <Circle bgColor={circleBgColor} size={6} ml={2} color={'white'} fontSize={'sm'}>
            {currentEvent.members.length}
          </Circle>
        </Flex>
        <Button
          leftIcon={<LuUserPlus className="LuUserPlus" size={20} />}
          size={'md'}
          colorScheme={'blue'}
          onClick={onMemberModalOpen}
        >
          Agregar
        </Button>
        <MemberModal
          isOpen={isMemberModalOpen}
          onClose={() => {
            setSelectedMember(undefined);
            onMemberModalClose();
          }}
          memberToEdit={selectedMember}
        />
      </Stack>
      <Stack mt={5} mb={10}>
        {currentEvent.members.length === 0 ? (
          <Text fontSize={'sm'} color={grayText}>
            No hay miembros aun, intenta agregando uno!
          </Text>
        ) : (
          <Stack
            spacing={4}
            maxH={'200px'}
            overflowY={'auto'}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollBarThumbColor,
                borderRadius: '24px',
              },
            }}
          >
            {currentEvent.members.map((member) => {
              return (
                <Flex
                  key={member.name}
                  alignItems={'center'}
                  ps={4}
                  mr={2}
                  borderRadius="lg"
                  justifyContent={'space-between'}
                  bg={cardBgColor}
                >
                  <Flex alignItems={'center'} gap={4}>
                    <Avatar size={'sm'} name={member.name} color={avatarColor} />
                    <Text>{member.name}</Text>
                  </Flex>
                  <ButtonGroup spacing={0}>
                    <IconButton
                      aria-label="Edit member"
                      icon={<LuUserPen size={24} color="white" />}
                      bgColor={'#517ff4'}
                      _hover={{
                        bgColor: '#3f6ac2',
                      }}
                      _active={{
                        bgColor: '#2e548f',
                      }}
                      size={'lg'}
                      px={6}
                      borderLeftRadius={0}
                      borderRightRadius={member.name === currentEvent.owner.name ? 'lg' : 0}
                      variant={'ghost'}
                      onClick={() => {
                        setSelectedMember(member);
                        onMemberModalOpen();
                      }}
                    />
                    {member.name !== currentEvent.owner.name && (
                      <IconButton
                        aria-label="Remove member"
                        icon={<LuUserX size={24} color="white" />}
                        bgColor={'#fc5344'}
                        _hover={{
                          bgColor: '#d63a2f',
                        }}
                        _active={{
                          bgColor: '#b12b1f',
                        }}
                        px={6}
                        size={'lg'}
                        borderLeftRadius={0}
                        variant={'ghost'}
                        onClick={() => {
                          setSelectedMember(member);
                          onDeleteMemberDialogOpen();
                        }}
                      />
                    )}
                  </ButtonGroup>
                </Flex>
              );
            })}
            <DeleteDialog
              isOpen={isDeleteMemberDialogOpen}
              onClose={onDeleteMemberDialogClose}
              onConfirm={() => deleteMember(selectedMember!)}
              title={'Eliminar miembro'}
            >
              <Text>
                ¿Estás seguro de que deseas eliminar a <strong>{selectedMember?.name}</strong> de
                todos los items y deudas asociadas? Esta acción no se puede deshacer.
              </Text>
            </DeleteDialog>
          </Stack>
        )}
      </Stack>
    </>
  );
}
