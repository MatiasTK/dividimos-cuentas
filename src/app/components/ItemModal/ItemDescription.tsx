'use client';

import { Input, Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

type props = {
  description: string;
  setDescription: (description: string) => void;
};

export default function ItemDescription({ description, setDescription }: props) {
  const [input, setInput] = useState(description);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDescription(input);
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <Box>
      <Text>Descripción</Text>
      <Input
        type="text"
        value={input}
        colorScheme="blackAlpha"
        borderColor={'whiteAlpha.300'}
        placeholder="Pizza"
        mt={2}
        _placeholder={{
          color: 'whiteAlpha.600',
        }}
        _hover={{
          borderColor: 'whiteAlpha.600',
        }}
        focusBorderColor="whiteAlpha.600"
        onChange={(e) => setInput(e.target.value)}
      />
    </Box>
  );
}
