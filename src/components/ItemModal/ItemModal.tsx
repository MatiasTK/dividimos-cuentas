import { Modal, ModalOverlay } from '@chakra-ui/react';
import { useState } from 'react';
import ItemModal__Description from '@components/ItemModal/ItemModal__Description';
import ItemModal__Payers from '@components/ItemModal/ItemModal__Payers';
import ItemModal__Split from '@components/ItemModal/ItemModal__Split';
import { Item, ModalTabs, Payer } from '@/types';
import { SplitMember } from '@/types/splitMember';
import { useEvent } from '@context/EventContext';

type ItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ItemModal({ isOpen, onClose }: ItemModalProps) {
  const [currentItem, setCurrentItem] = useState<Item>({
    id: '',
    description: '',
    paidBy: [],
    splitBetween: [],
  });

  const { addItem } = useEvent();

  const [currentTab, setCurrentTab] = useState(ModalTabs.Description);

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
    const finalItem = { ...currentItem, splitBetween: members };
    addItem(finalItem);
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
        return <ItemModal__Description itemInfo={currentItem} onTabDone={handleNext} />;
      case ModalTabs.Payers:
        return (
          <ItemModal__Payers
            itemInfo={currentItem}
            setPayers={setPaidByMembers}
            goBack={handleBack}
          />
        );
      case ModalTabs.Split:
        return (
          <ItemModal__Split
            itemInfo={currentItem}
            goBack={handleBack}
            setSplitMembers={setSplitMembers}
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'sm'}>
      <ModalOverlay />
      {renderTab()}
    </Modal>
  );
}
