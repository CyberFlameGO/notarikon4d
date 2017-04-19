import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import store from '../utils/store';
import { RECEIVE_USER, RECEIVE_USERS } from './userActions';

const query = `{
  users {
    _id
    username
    name {
      first
      last
    }
    dateCreated
  }
}`;

export default async function bigFetch() {
  const { dispatch } = store;
  const { data, errors } = await graphFetcher(query);

  if (data.status === 401) dispatch(push(data.redirect));
  if (errors) throw new Error('Error!', errors);

  const { users } = data.data;
  const dispatchers = [
    { type: RECEIVE_USERS, users },
  ];

  const receivedAt = Date.now();
  dispatchers.forEach(obj => dispatch({ ...obj, receivedAt }));
}
