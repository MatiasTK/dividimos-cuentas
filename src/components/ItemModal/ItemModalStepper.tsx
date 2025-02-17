import {
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
} from '@chakra-ui/react';
import useCustomColor from '@hooks/useCustomColor';

const steps = [
  {
    title: 'Detalles',
  },
  {
    title: 'Pagos',
  },
  {
    title: 'División',
  },
];

type ItemModalStepperProps = {
  activeStep: number;
};

export default function ItemModalStepper({ activeStep }: ItemModalStepperProps) {
  const { completedIconColor } = useCustomColor();

  return (
    <Box mb={6}>
      <Stepper index={activeStep} size={'sm'}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon color={completedIconColor} />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
