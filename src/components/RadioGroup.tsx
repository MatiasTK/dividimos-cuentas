import { HStack, useRadioGroup } from '@chakra-ui/react';
import RadioCard from './RadioCard';
import { LuCircleDollarSign, LuEqual, LuPercent } from 'react-icons/lu';
import { SplitMember } from '@/types/splitMember';

type RadioGroupProps = {
  value: SplitMember['splitMethod'];
  onChange: (value: string) => void;
  name: string;
};

export default function RadioGroup({ value, onChange, name }: RadioGroupProps) {
  const type = value ? value.type : 'equal';
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange,
    value: type,
  });

  return (
    <HStack {...getRootProps()}>
      <RadioCard {...getRadioProps({ value: 'equal' })} name={`${name}-equal`}>
        <LuEqual size={20} />
      </RadioCard>
      <RadioCard {...getRadioProps({ value: 'fixed' })} name={`${name}-fixed`}>
        <LuCircleDollarSign size={20} />
      </RadioCard>
      <RadioCard {...getRadioProps({ value: 'percentage' })} name={`${name}-percentage`}>
        <LuPercent size={20} />
      </RadioCard>
    </HStack>
  );
}
