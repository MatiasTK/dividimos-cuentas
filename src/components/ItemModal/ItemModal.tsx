import { Modal, ModalOverlay } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ItemModal__Description from '@components/ItemModal/ItemModal__Description';
import ItemModal__Payers from '@components/ItemModal/ItemModal__Payers';
import ItemModal__Split from '@components/ItemModal/ItemModal__Split';
import { Item, ModalTabs, Payer } from '@/types';
import { SplitMember } from '@/types/splitMember';
import { useEvent } from '@hooks/useEvent';

type ItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: Item;
};

export default function ItemModal({ isOpen, editingItem, onClose }: ItemModalProps) {
  const [currentItem, setCurrentItem] = useState<Item>({
    id: '',
    description: '',
    paidBy: [],
    splitBetween: [],
  });

  const { addItem, editItem } = useEvent();

  const [currentTab, setCurrentTab] = useState(ModalTabs.Description);

  useEffect(() => {
    if (editingItem) {
      setCurrentItem(editingItem);
      setCurrentTab(ModalTabs.Description);
    } else {
      setCurrentItem({
        id: '',
        description: '',
        paidBy: [],
        splitBetween: [],
      });
    }
  }, [editingItem]);

  const handleNext = (description: string) => {
    setCurrentItem((prevItem) => ({
      ...prevItem,
      description,
    }));
    setCurrentTab(ModalTabs.Payers);
  };

  const handleBack = () => {
    switch (currentTab) {
      case ModalTabs.Payers:
        setCurrentTab(ModalTabs.Description);
        break;
      case ModalTabs.Split:
        setCurrentTab(ModalTabs.Payers);
        break;
    }
  };

  const setPaidByMembers = (members: Payer[]) => {
    setCurrentItem((prevItem) => ({
      ...prevItem,
      paidBy: members,
    }));
    setCurrentTab(ModalTabs.Split);
  };

  const setSplitMembers = (members: SplitMember[]) => {
    if (editingItem) {
      const finalItem = { ...currentItem, splitBetween: members };
      editItem(editingItem.id, finalItem);
    } else {
      const finalItem = { ...currentItem, splitBetween: members };
      addItem(finalItem);
    }
    setCurrentItem({
      id: '',
      description: '',
      paidBy: [],
      splitBetween: [],
    });

    setCurrentTab(ModalTabs.Description);
    onClose();
  };

  const renderTab = () => {
    switch (currentTab) {
      case ModalTabs.Description:
        return (
          <ItemModal__Description
            itemInfo={currentItem}
            onTabDone={handleNext}
            isEditing={!!editingItem}
          />
        );
      case ModalTabs.Payers:
        return (
          <ItemModal__Payers
            itemInfo={currentItem}
            setPayers={setPaidByMembers}
            goBack={handleBack}
            isEditing={!!editingItem}
          />
        );
      case ModalTabs.Split:
        return (
          <ItemModal__Split
            itemInfo={currentItem}
            goBack={handleBack}
            setSplitMembers={setSplitMembers}
            isEditing={!!editingItem}
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (editingItem) {
          setCurrentTab(ModalTabs.Description);
        }
        onClose();
      }}
      isCentered
      size={'sm'}
    >
      <ModalOverlay />
      {renderTab()}
    </Modal>
  );
}
