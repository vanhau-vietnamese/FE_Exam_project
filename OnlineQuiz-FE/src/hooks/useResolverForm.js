import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const useResolverForm = ({ schema, configs }) => {
  return useForm({ ...configs, resolver: yupResolver(schema) });
};
