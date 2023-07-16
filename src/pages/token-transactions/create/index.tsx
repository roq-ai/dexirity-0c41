import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTokenTransaction } from 'apiSdk/token-transactions';
import { Error } from 'components/error';
import { tokenTransactionValidationSchema } from 'validationSchema/token-transactions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { getOrganizations } from 'apiSdk/organizations';
import { getUsers } from 'apiSdk/users';
import { TokenTransactionInterface } from 'interfaces/token-transaction';

function TokenTransactionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TokenTransactionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTokenTransaction(values);
      resetForm();
      router.push('/token-transactions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TokenTransactionInterface>({
    initialValues: {
      transaction_type: '',
      token_amount: 0,
      organization_id: (router.query.organization_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: tokenTransactionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Token Transaction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="transaction_type" mb="4" isInvalid={!!formik.errors?.transaction_type}>
            <FormLabel>Transaction Type</FormLabel>
            <Input
              type="text"
              name="transaction_type"
              value={formik.values?.transaction_type}
              onChange={formik.handleChange}
            />
            {formik.errors.transaction_type && <FormErrorMessage>{formik.errors?.transaction_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="token_amount" mb="4" isInvalid={!!formik.errors?.token_amount}>
            <FormLabel>Token Amount</FormLabel>
            <NumberInput
              name="token_amount"
              value={formik.values?.token_amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('token_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.token_amount && <FormErrorMessage>{formik.errors?.token_amount}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'token_transaction',
    operation: AccessOperationEnum.CREATE,
  }),
)(TokenTransactionCreatePage);
