import axios from 'axios';
import queryString from 'query-string';
import { TokenTransactionInterface, TokenTransactionGetQueryInterface } from 'interfaces/token-transaction';
import { GetQueryInterface } from '../../interfaces';

export const getTokenTransactions = async (query?: TokenTransactionGetQueryInterface) => {
  const response = await axios.get(`/api/token-transactions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTokenTransaction = async (tokenTransaction: TokenTransactionInterface) => {
  const response = await axios.post('/api/token-transactions', tokenTransaction);
  return response.data;
};

export const updateTokenTransactionById = async (id: string, tokenTransaction: TokenTransactionInterface) => {
  const response = await axios.put(`/api/token-transactions/${id}`, tokenTransaction);
  return response.data;
};

export const getTokenTransactionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/token-transactions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTokenTransactionById = async (id: string) => {
  const response = await axios.delete(`/api/token-transactions/${id}`);
  return response.data;
};
