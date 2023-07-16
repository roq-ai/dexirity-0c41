import * as yup from 'yup';

export const tokenTransactionValidationSchema = yup.object().shape({
  transaction_type: yup.string().required(),
  token_amount: yup.number().integer().required(),
  organization_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
