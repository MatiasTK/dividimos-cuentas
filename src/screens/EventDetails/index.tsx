import { Box } from '@chakra-ui/react';
import { useEvent } from '@hooks/useEvent';
import { calculateFinalSettlement } from '@lib/calculateBills';
import ActionsSection from './ActionsSection';
import DebtsSection from './DebtsSection';
import EventHeader from './EventHeader';
import ItemsSection from './ItemsSection';
import MembersSection from './MembersSection';

export default function EventDetails() {
  const { currentEvent } = useEvent();

  const finalSettlements = calculateFinalSettlement(currentEvent.items);

  return (
    <Box mt={5}>
      <EventHeader />
      <MembersSection />
      <ItemsSection />
      <DebtsSection finalSettlements={finalSettlements} />
      <ActionsSection finalSettlements={finalSettlements} />
    </Box>
  );
}
