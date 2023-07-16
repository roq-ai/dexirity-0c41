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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getTokenTransactionById, updateTokenTransactionById } from 'apiSdk/token-transactions';
import { Error } from 'components/error';
import { tokenTransactionValidationSchema } from 'validationSchema/token-transactions';
import { TokenTransactionInterface } from 'interfaces/token-transaction';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { getOrganizations } from 'apiSdk/organizations';
import { getUsers } from 'apiSdk/users';

function TokenTransactionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TokenTransactionInterface>(
    () => (id ? `/token-transactions/${id}` : null),
    () => getTokenTransactionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TokenTransactionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTokenTransactionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/token-transactions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TokenTransactionInterface>({
    initialValues: data,
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
            Edit Token Transaction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(TokenTransactionEditPage);
